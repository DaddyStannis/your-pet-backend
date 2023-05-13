import express from "express"

import { schemas } from "../../models/pet.js"
import petsControllers from "../../controllers/pets-controllers.js"
import { authenticate, upload } from "../../middlewares/index.js"
import { validateBody } from "../../decorators/index.js"

const router = express.Router();

router.use(authenticate)

router.get('/', petsControllers.listPet)

router.post('/', upload.single('photoURL'), validateBody(schemas.addPetSchema), petsControllers.addPet)

router.delete('/:id', petsControllers.deletePet)

export default router