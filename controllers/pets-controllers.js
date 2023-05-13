import path from "path";

import { Pet } from "../models/pet.js"
import { ctrlWrapper } from "../decorators/index.js"
import { moveFile, resizeImg, HttpError } from "../helpers/index.js"

const listPet = async (req, res) => {
    const { _id: owner } = req.user
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit
    const result = await Pet.find({ owner }, '', { skip, limit })
    res.json(result)
}

const petAvatarsDirPath = path.resolve("public", "petPhotos");

const addPet = async (req, res) => {
    const { _id: owner } = req.user

    await moveFile(req.file, petAvatarsDirPath);
    await resizeImg(path.join(petAvatarsDirPath, req.file.filename), 300);
    const photoURL = path.join("petPhotos", req.file.filename)

    const result = await Pet.create({ ...req.body, photoURL, owner });
    
    res.status(201).json(result);
}

const deletePet = async (req, res) => {
    const { id } = req.params
    const result = await Pet.findByIdAndDelete(id)
    if (!result) {
      throw HttpError(404, `Pet with ${id} not found`)
    }
    res.status(200).json({message: "Pet deleted"})
}

export default {
    listPet: ctrlWrapper(listPet),
    addPet: ctrlWrapper(addPet),
    deletePet: ctrlWrapper(deletePet),
}