var express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
var router = express.Router();

var Contact = require("../models/contact");



router.get("/list", (req, res, next) => {
  Contact.find().then((users) => {
    res.render("form2.twig", {
      title: "Contact list",
      cnt: users,
    });
  });
});





router.get("/new", (req, res) => {
    res.render("add_contact_success.twig"); 
});

router.post("/new", async (req, res) => {
    try {
        const { FullName, Phone } = req.body;
        const newContact = new Contact({ FullName, Phone });
        const savedContact = await newContact.save();
        console.log("New Contact : ", savedContact);
        //res.render("add_contact_success.twig", { newContact: savedContact });
        res.redirect("/contacts/list");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding data");
    }
});



router.post("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return res.status(404).send("Contact not found");
    }
    res.redirect("/contacts/list");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting data");
  }
});





router.get("/edit/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const contact = await Contact.findById(id);
      if (!contact) {
        return res.status(404).send("Contact not found");
      }
      res.render("edit_contact.twig", { contact: contact });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching contact data");
    }
  });
  

  
  router.post("/update/:id", async (req, res) => {
    const { id } = req.params;
    const newData = req.body;
    try {
      const updatedContact = await Contact.findByIdAndUpdate(id, newData, { new: true });
      if (!updatedContact) {
        return res.status(404).send("Contact not found");
      }
      res.redirect("/contacts/list");
    } catch (err) {
      console.error("Error updating contact: ", err);
      res.status(500).send("Error updating contact");
    }
  });
  


router.get("/search", async (req, res) => {
    const { fullName } = req.query;
    try {
      const contacts = await Contact.find({ FullName: fullName });
      res.render("search_results.twig", { contacts: contacts });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });
  




module.exports = router;
