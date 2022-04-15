var express = require("express");
var router = express.Router();

const db = require("../db/models");
const { requireAuth } = require("../auth");
const { csrfProtection, asyncHandler, storiesByTags } = require("./utils");

router.get('/tags/:id', asyncHandler(async(req,res, next) =>{
    const tag = req.params.id

    const tagName = await db.Tag.findByPk(tag)

    const tagStories = await storiesByTags(tag);

    const user = await db.User.findByPk(req.session.auth.userId)

    const {stories} = tagStories

    res.render('tag-feed', {
        stories,
        user,
        tagName,
        tag
    })
}))

router.post('/tags/:id/follow', asyncHandler(async (req, res, next) => {
    const tag = req.params.id

    const tagName = await db.Tag.findByPk(tag)

    const user = await db.User.findByPk(req.session.auth.userId)

    const followCheck = await db.UserTag.findAll({
        where: {
            userId: user.id,
            tagId: tag
        },
    })

    if(followCheck.length){
        return
    }else{
        const newFollow = await db.UserTag.create({
            userId: user.id,
            tagId: tag
        })

        await newFollow.save()

        res.redirect('back')
    }


}))

router.delete('/tags/:id/follow', asyncHandler(async (req, res, next) => {
    const tag = req.params.id

    const tagName = await db.Tag.findByPk(tag)

    const user = await db.User.findByPk(req.session.auth.userId)

    const followCheck = await db.UserTag.findAll({
        where: {
            userId: user.id,
            tagId: tag
        },
    })

    if (!followCheck.length) {
        return
    } else {
        followCheck[0].destroy()

        res.redirect('back')
    }


}))



module.exports = router