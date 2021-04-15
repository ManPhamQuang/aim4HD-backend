const Skill = require("../models/Skill");

exports.getAllSkills = async (req, res, next) => {
    try {
        const skills = await Skill.find();
        return res.status(200).json({
            skills,
        });
    } catch (error) {
        return res.status(400).json({
            error,
        });
    }
};
