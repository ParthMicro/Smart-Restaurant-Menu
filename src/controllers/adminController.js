const Item = require('../models/itemModel'); // Assuming you have an Item model

exports.showAddForm = (req, res) => {
    res.render('admin/addItem');
};

exports.addItem = async (req, res) => {
    const newItem = new Item(req.body);
    await newItem.save();
    res.redirect('/admin/items');
};

exports.listItems = async (req, res) => {
    const items = await Item.find();
    res.render('admin/itemList', { items });
};

exports.showEditForm = async (req, res) => {
    const item = await Item.findById(req.params.id);
    res.render('admin/editItem', { item });
};

exports.editItem = async (req, res) => {
    await Item.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/admin/items');
};

exports.deleteItem = async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.redirect('/admin/items');
};
