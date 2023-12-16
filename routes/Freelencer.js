const router = require("express").Router();
const verifyToken = require("./authentication");

const {AddsampleProject,GetReviews,Notifications,UpdateFreelancer, DeleteFreelancer, GetAllProjects, ProjectApproved, ProjectRejected, ProjectDeliverd, GetSellerProjects, SearchSeller} = require('../Controller/Freelencer_api');
const {sendMessage} = require('../Controller/Chat');

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


router.post('/sendmessage/:receiverId',verifyToken, sendMessage);

module.exports=router;