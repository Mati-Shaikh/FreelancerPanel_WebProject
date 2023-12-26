const router = require("express").Router();
const verifyToken = require("./authentication");

const {getPaymentHistory,GetNewProposal,GetPresentProposals,AddsampleProject,GetReviews,Notifications,UpdateFreelancer, DeleteFreelancer, GetAllProjects, ProjectApproved, ProjectRejected, ProjectDeliverd, GetSellerProjects, SearchSeller, GetProfile} = require('../Controller/Freelencer_api');
const {sendMessage,getMessages} = require('../Controller/Chat');

router.put('/updateFreelancer',verifyToken,UpdateFreelancer);
router.delete('/deleteFreelancer',verifyToken,DeleteFreelancer);
router.get('/getallProjects',verifyToken,GetAllProjects);
router.post('/ProjectApproved/:id',verifyToken,ProjectApproved);
router.post('/ProjectReject/:id',verifyToken,ProjectRejected);
router.get('/notifications',verifyToken,Notifications);
router.post('/ProjectDelivered/:id',verifyToken,ProjectDeliverd);
router.get('/getreviews',verifyToken,GetReviews);
router.post('/addSampleProject',verifyToken,AddsampleProject);
router.get('/getsellerprojects',verifyToken,GetSellerProjects);
router.get('/searchSeller',verifyToken,SearchSeller);
router.get('/getProfile',verifyToken,GetProfile);
router.get('/getPresentProposals',verifyToken,GetPresentProposals);
router.get('/getnewProposal',verifyToken,GetNewProposal);
router.get('/getPaymentHistory',verifyToken,getPaymentHistory);


router.post('/sendmessage/:receiverId',verifyToken, sendMessage);
router.get('/getMessage/:receiverId',verifyToken, getMessages);

module.exports=router;