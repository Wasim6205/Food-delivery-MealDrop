import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req,res) => {
    try {
        const {name,category,foodType,price} = req.body
        let image;
        if(req.file){
            image = await uploadOnCloudinary(req.file.path)
        }
        const shop = await Shop.findOne({owner:req.userId})
        if(!shop){
            return res.status(404).json({message:"Shop not found"})
        }
        const item = await Item.create({
            name,category,foodType,price,image,shop:shop._id
        })

        shop.items.push(item._id)
        await shop.save()
        await shop.populate("owner")
        await shop.populate({
            path:"items",
            options:{sort:{updatedAt:-1}}
        })
        return res.status(201).json(shop)
    } catch (error) {
        return res.status(500).json({message: `Add item error ${error}`})
    }
}

export const editItem = async (req,res) => {
    try {
        const itemId = req.params.itemId
        const {name,category,foodType,price} = req.body
        let image;
        if(req.file){
            image = await uploadOnCloudinary(req.file.path)
        }
        const item = await Item.findByIdAndUpdate(itemId,{
            name,category,foodType,price,image
        },{new:true})
        if(!item){
            return res.status(404).json({message:"Item not found"})
        }
        const shop = await Shop.findOne({owner:req.userId}).populate({
            path:"items",
            options:{sort:{updatedAt:-1}}
        })
        return res.status(200).json(shop)
    } catch (error) {
        return res.status(500).json({message: `Edit item error ${error}`})
    }
}

export const getItemById = async (req,res) => {
    try {
        const {itemId} = req.params
        const item = await Item.findById(itemId)
        if(!item){
            return res.status(404).json({message:"Item not found"})
        }
        return res.status(200).json(item)
    } catch (error) {
        return res.status(500).json({message: `Get item error ${error}`})
    }
}

export const deleteItem = async (req,res) => {
    try {
        const itemId = req.params.itemId
        const item = await Item.findByIdAndDelete(itemId)
        if(!item){
            return res.status(404).json({message:"Item not found"})
        }
        const shop = await Shop.findOne({owner:req.userId})
        shop.items = shop.items.filter(i=>i._id!==item._id)
        await shop.save()
        await shop.populate({
            path:"items",
            options:{sort:{updatedAt:-1}}
        })
        return res.status(200).json(shop)
    } catch (error) {
        return res.status(500).json({message: `Delete item error ${error}`})
    }
}

export const getItemByCity = async (req,res) => {
    try {
        const {city} = req.params
        if(!city){
            return res.status(400).json({message:"city is required"})
        }
        const shops = await Shop.find({
            city:{$regex:new RegExp(`^${city}`, "i")}
        }).populate("items")
        if(!shops){
            return res.status(404).json({message:"No shops found at your location"})
        }
        const shopIds = shops.map((shop)=>shop._id)
        
        const items = await Item.find({shop:{$in:shopIds}})
        
        if(!items){
            return res.status(404).json({message:"No items found at your location"})
        }
        
        return res.status(200).json({items})
    } catch (error) {
        return res.status(500).json({message: `Get Itembycity error ${error}`})
    }
}

export const getItemsByShop = async (req,res) => {
    try {
        const {shopId} = req.params
        const shop = await Shop.findById(shopId).populate("items")
        if(!shop){
            return res.status(404).json({message:"shop not found"})
        }
        return res.status(200).json({
            shop,items:shop.items
        })
    } catch (error) {
        return res.status(500).json({message: `Get Itemby shop error ${error}`})
    }
}

export const searchItems = async (req,res) => {
    try {
        const {query,city} = req.query
        if(!query || !city){
            return null
        }
        const shops = await Shop.find({
            city:{$regex:new RegExp(`^${city}`, "i")}
        }).populate("items")
        if(!shops){
            return res.status(404).json({message:"No shops found at your location"})
        }
        const shopIds = shops.map(s=>s._id)
        const items = await Item.find({
            shop:{$in:shopIds},
            $or:[
                {name:{$regex:query,$options:"i"}},
                {category:{$regex:query,$options:"i"}}
            ]
        }).populate("shop","name image")
        return res.status(200).json(items)
    } catch (error) {
        return res.status(500).json({message: `Search Item error ${error}`})
    }
}


export const rating = async (req,res) => {
  try {
    const {itemId,rating} = req.body
    if(!itemId || !rating){
        return res.status(400).json({essage:"itemid and rating is required"})
    }
    if(rating<1 || rating>5){
        return res.status(400).json({essage:"rating must be between 1 to 5"})
    }

    const item = await Item.findById(itemId)
    if(!item){
        return res.status(400).json({essage:"item not found"})
    }
    const newCount = item.rating.count + 1
    const newAverage = (item.rating.average*item.rating.count + rating) / newCount

    item.rating.count = newCount
    item.rating.average = newAverage
    await item.save()
    return res.status(200).json({rating:item.rating})
  } catch (error) {
    return res.status(500).json({message: `Rating error ${error}`})
  }
}