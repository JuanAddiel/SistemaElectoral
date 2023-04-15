exports.getWelcome = (req,res,next) =>{
    res.status(202).render("welcome",{pageTitle: "Welcome"});
}