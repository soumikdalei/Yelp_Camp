const campground = require("../model/campground")
const { cloudinary } = require('../cloudinary');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
module.exports.index = async (req, res) => {
    const campgrounds = await campground.find({})
    res.render('campgrounds/index', { campgrounds })

}
module.exports.new = (req, res) => {

    res.render('campgrounds/new')
}
module.exports.createcampground = async (req, res, next) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const camp = new campground(req.body.campground);
    camp.geometry = geoData.features[0].geometry;
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.author = req.user._id
    await camp.save()
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${camp._id}`)
}
module.exports.showcampground = async (req, res) => {
    const { id } = req.params
    const camp = await campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author')
    if (!camp) {
        req.flash('error', 'No campground found corresponding to this is id')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { camp })
}
module.exports.editcamp = async (req, res) => {
    const { id } = req.params
    const camp = await campground.findById(id)
    if (!camp) {
        req.flash('error', 'Campground is deleted so it dose not exist')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { camp })
}
module.exports.editcamps = async (req, res) => {

    const { id } = req.params

    const camp = await campground.findByIdAndUpdate(id, { ...req.body.campground })
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    camp.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    camp.images.push(...imgs)
    await camp.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('edit', 'Successfully updated the campground')
    res.redirect(`/campgrounds/${camp._id}`)

}
module.exports.delete = async (req, res) => {
    const { id } = req.params
    const campi = await campground.findById(id)
    if (!campi.author.equals(req.user._id)) {
        req.flash('error', 'You cannot delete this campground')
        return res.redirect(`/campgrounds/${id}`)
    }
    await campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}