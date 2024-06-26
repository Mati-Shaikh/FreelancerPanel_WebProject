const jwt = require("jsonwebtoken");
const Freelance = require('../models/Freelance_Plateform')
const Projects = require('../models/Projects.schema')
const Clients = require('../models/Customer.schema');
const Seller = require('../models/SellerProjects.schema');
const SellerProject = require('../models/SellerProjects.schema');
const Customer =  require('../models/Customer.schema');
const CustomerProject =  require('../models/Projects.schema');

let GetProfile = async (req,res) =>{
  const userId = res.locals.userId; // Assuming your middleware sets the user ID in req.user

  try {
    const userProfile = await Freelance.findById(userId);

    if (!userProfile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



let UpdateFreelancer = async (req, res) => {
  // User ID is available from the middleware
  let id = res.locals.userId;
  let data = req.body;

  try {
    let user = await Freelance.findByIdAndUpdate(id, data, { new: true });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', err: err });
  }
};

let DeleteFreelancer =  async(req ,res)=>{
    let id = res.locals.userId;
    let users = await Freelance.findByIdAndDelete(id);
    if(users)
    {
       res.status(200).json(users)
    }else
    {
      res.status(404).json({"Message":"Error" , err:err})
    }
}
const GetAllProjects = async (req, res) => {
  try {
    // Retrieve all projects
    const projects = await Projects.find();

    // Sort projects by date (createdAt) in descending order
    const sortedProjects = projects.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json(sortedProjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const GetPresentProposals = async (req, res) => {
  try {
    // Retrieve projects with status 'APPROVED'
    const projects = await Projects.find({
      Assigned: res.locals.userId,
      Status: 'APPROVED', // Corrected line
    });

    // Sort projects by date (createdAt) in descending order
    const sortedProjects = projects.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json({ projects: sortedProjects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



let GetSellerProjects =async (req,res)=>{
 try{
    const seller= await Seller.find();
    res.status(200).json(seller);
  } catch (err) {
    res.status(500).json(err);
  }
}
let ProjectApproved = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Projects.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Update the status to 'APPROVED'
    project.Status = 'APPROVED';

    // Save the updated project
    await project.save();

    // Notify the client
    const client = await Customer.findById(project.UserId);

    // Check if Notifications array exists, if not, initialize it
    if (!client.Notifications) {
      client.Notifications = [];
    }

    // Push notification object with message and createdAt
    client.Notifications.push({
      message: `Your project (${project.Title}) has been approved by Freelancer (${res.locals.userFullName})`,
      createdAt: new Date(),
    });

    await client.save();

    // Notify the freelancer
    const freelancer = await Freelance.findById(res.locals.userId);

    // Check if Notifications array exists, if not, initialize it
    if (!freelancer.Notifications) {
      freelancer.Notifications = [];
    }

    // Push notification object with message and createdAt
    freelancer.Notifications.push({
      message: `You approved the project (${project.Title}).`,
      createdAt: new Date(),
    });

    await freelancer.save();

    res.status(200).json({
      message: 'Project approved successfully',
      // deductionMessage: `Amount (${deductedAmount}) deducted from the Client's Account.`,
      // additionMessage: `Amount (${deductedAmount}) added to the Freelancer's Account.`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


let ProjectRejected = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Projects.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Ensure that the project is in the 'WAITING FOR APPROVAL' status
    // if (project.Status !== 'WAITING FOR APPROVAL') {
    //   return res.status(400).json({ error: 'Cannot reject project in its current status' });
    // }

    // Get customer and freelancer details
    const client = await Customer.findById(project.UserId);
    const freelancer = await Freelance.findById(project.Assigned);

    // Check if the project is assigned to the current freelancer making the request
    const freelancerId = res.locals.userId;
    if (project.Assigned !== freelancerId) {
      return res.status(403).json({ message: 'You are not assigned to this project' });
    }

    // Update the project status to 'REJECTED'
    project.Status = 'REJECTED';

    // Unfreeze the amount in the customer's account
    client.AccountBalance += project.Budget;
    client.FreezeBalance -= project.Budget;

    // Save the updated project and customer details
    await project.save();
    await client.save();

    // Notify the client about project rejection
    client.Notifications.push({
      message: `Your project (${project.Title}) has been rejected by Freelancer (${res.locals.userFullName})`,
      createdAt: new Date(),
    });
    await client.save();

    // Notify the freelancer about project rejection
    freelancer.Notifications.push({
      message: `You rejected the project (${project.Title}).`,
      createdAt: new Date(),
    });
    await freelancer.save();

    res.status(200).json({ message: 'Project rejected successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const Notifications = async (req, res) => {
  try {
    let id = res.locals.userId;

    // Check if the user is a freelancer
    const freelancer = await Freelance.findById(id);

    if (freelancer) {
      // Sort notifications by date (createdAt) in descending order
      const notifications = freelancer.Notifications.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      return res.status(200).json({ notifications });
    }

    // If the user is neither a client nor a freelancer
    return res.status(404).json({ message: 'User not found' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

let ProjectDeliverd = async (req, res) => {
  try {
    const projectId = req.params.id;

    // Find the project by ID
    const project = await Projects.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the project is assigned to the freelancer making the request
    const freelancerId = res.locals.userId;
    if (project.Assigned !== freelancerId) {
      return res.status(403).json({ message: 'You are not assigned to this project' });
    }

    // Update the project status to 'DELIVERED' only if it's in 'APPROVED' state
    if (project.Status === 'APPROVED') {
      project.Status = 'DELIVERED';

      // Save the updated project
      await project.save();
      
      // Notify the client
      const client = await Clients.findById(project.UserId);
      const freelancer = await Freelance.findById(freelancerId);
      const deductedAmount = project.Budget;
      client.FreezeBalance -= deductedAmount;

      //Adding Amount into the Freelancer Account
      if (!isNaN(deductedAmount)) {
        freelancer.AccountBalance = isNaN(freelancer.AccountBalance) ? deductedAmount : freelancer.AccountBalance + deductedAmount;
      }

      // Check if Notifications array exists, if not, initialize it
      if (!client.Notifications) {
        client.Notifications = [];
      }

      // Push notification object with message and createdAt
      client.Notifications.push({
        message: `You have a new project delivery (${project.Title}) by Freelancer (${res.locals.userFullName})`,
        createdAt: new Date(),
      });

      //Notication from the Client Side
    client.Notifications.push({
      message: `Your Amount (${deductedAmount}) of (${project.Title}) has been Deducted from your Freeze Account and has been added to the Freelancer (${res.locals.userFullName}) Account`,
      createdAt: new Date(),
    });
    client.PaymentHistory.push({
      message: `Amount (${deductedAmount}) of (${project.Title}) has been Deducted from your Freeze Account and has been added to the Freelancer (${res.locals.userFullName}) Account`,
      createdAt: new Date(),
    });

      await client.save();

      // Notify the freelancer
      
     
      // Check if Notifications array exists, if not, initialize it
      if (!freelancer.Notifications) {
        freelancer.Notifications = [];
      }

      // Push notification object with message and createdAt
      freelancer.Notifications.push({
        message: `You have successfully delivered the project (${project.Title}) to the Customer (${project.Username}).`,
        createdAt: new Date(),
      }); 
      //Notification of Amount in Freelancer
    freelancer.Notifications.push({
      message: `Your Amount (${deductedAmount}) of (${project.Title}) has been added in your Account from Customer (${project.Username}).`,
      createdAt: new Date(),
    });


    freelancer.PaymentHistory.push({
      message: `Amount (${deductedAmount}) of (${project.Title}) has been added in your Account from Customer (${project.Username}).`,
      createdAt: new Date(),
    });

      await freelancer.save();

      res.status(200).json({ message: 'Project delivered successfully' });
    } else {
      res.status(200).json({ message: 'Project has not been approved yet' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const GetReviews = async(req, res) => {
  try {
    // Assuming you have a middleware to extract the user ID from the token and set it in req.userId
    const userId = res.locals.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // You can also use other criteria to find the user based on your application logic
    const user = await Freelance.findById(userId).exec();

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const AvgRating = user.AvgRating || 0;
    const TotalNumberofFeddbacks= user.TotalNumberofFeddbacks;
    const TotalRating = user.TotalRating;
    res.json({ AvgRating,TotalNumberofFeddbacks,TotalRating });
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}
};
let AddsampleProject = async (req,res) => {
  try {
    const freelancerId = res.locals.userId; // Assuming you send freelancerId in the request body
    const sampleProjectData = req.body.sampleProject; // Assuming you send sampleProject data in the request body

    // Find the Freelancer by ID
    const freelancer = await Freelance.findById(freelancerId);

    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    // Add the new sample project to the Samples array
    freelancer.Samples.push(sampleProjectData);

    // Save the updated Freelancer document
    await freelancer.save();

    res.status(200).json({ message: 'Sample project added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

const UpdateSampleProject = async (req, res) => {
  try {
    const freelancerId = res.locals.userId;
    const sampleProjectId = req.params.id; // Assuming you send the sample project's ID as a URL parameter
    const updatedData = req.body; // Assuming you send the updated sample project data in the request body

    // Find the Freelancer by ID
    const freelancer = await Freelance.findById(freelancerId);

    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    // Find the sample project by ID and update it
    const sampleIndex = freelancer.Samples.findIndex(sample => sample.id === sampleProjectId);
    if (sampleIndex === -1) {
      return res.status(404).json({ message: 'Sample project not found' });
    }

    freelancer.Samples[sampleIndex] = { ...freelancer.Samples[sampleIndex], ...updatedData };

    // Save the updated Freelancer document
    await freelancer.save();

    res.status(200).json({ message: 'Sample project updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}


const DeleteSampleProject = async (req, res) => {
  try {
    const freelancerId = res.locals.userId;
    const sampleProjectId = req.params.id; // Assuming you send the sample project's ID as a URL parameter
    console.log(sampleProjectId)
    // Find the Freelancer by ID
    const freelancer = await Freelance.findById(freelancerId);

    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    // Remove the sample project from the Samples array
    freelancer.Samples = freelancer.Samples.filter(sample => sample.id !== sampleProjectId);

    // Save the updated Freelancer document
    await freelancer.save();

    res.status(200).json({ message: 'Sample project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}


let SearchSeller = async (req, res) => {
  try {
    const { query } = req.query;

    // Use regular expressions for case-insensitive partial matching
    const sellers = await Seller.find({ FullName: { $regex: new RegExp(query, 'i') } });
    const sellerProjects = await SellerProject.find({ Title: { $regex: new RegExp(query, 'i') } });
    const customerProjects = await CustomerProject.find({ Title: { $regex: new RegExp(query, 'i') } });
    const customers = await Customer.find({ Interests: { $regex: new RegExp(query, 'i') } });

    res.status(200).json({ sellers, sellerProjects, customerProjects, customers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
const GetNewProposal = async (req, res) => {
  try {
    // Fetch projects where the current user is assigned and the status is not APPROVED or DELIVERED
    const projects = await Projects.find({
      Assigned: res.locals.userId,
      Status: { $nin: ['REJECTED', 'DELIVERED', 'APPROVED'] },
    });

    // Sort projects by date (createdAt) in descending order
    const sortedProjects = projects.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    if (sortedProjects.length > 0) {
      res.status(200).json({ projects: sortedProjects });
    } else {
      res.status(404).json({ message: 'No new proposals found for the current user.' });
    }
  } catch (error) {
    console.error('Error during fetching new proposals:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
let getPaymentHistory = async (req, res) => {
  try {
    // Get the freelanceId from res.locals.userId
    let freelanceId = res.locals.userId;

    // Find the Freelance document by ID
    const freelance = await Freelance.findById(freelanceId);

    // Check if the Freelance document is found
    if (!freelance) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    // Get the PaymentHistory array from the Freelance document
    let paymentHistory = freelance.PaymentHistory;

    // Sort the payment history by date and time in descending order
    // Assuming each payment history item has a 'dateTime' field
    paymentHistory.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

    // Respond with the sorted PaymentHistory array
    res.status(200).json({ paymentHistory });
  } catch (err) {
    console.error('Error during fetching payment history:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};





module.exports = {UpdateSampleProject,DeleteSampleProject,getPaymentHistory,GetNewProposal,GetPresentProposals,SearchSeller,GetSellerProjects,AddsampleProject,GetReviews ,ProjectDeliverd,Notifications,ProjectApproved,ProjectRejected, UpdateFreelancer,DeleteFreelancer, GetAllProjects,GetProfile};