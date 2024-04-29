import * as express from "express";
import { UserController } from "../controllers/User.Controller";
import { AuthController } from "../controllers/Auth.Controller";
import { authentification } from "../middleware/auth.middleware";
import { UnitController } from "../controllers/Unit.Controller";
import { VendorController } from "../controllers/Vendor.Controller";
const Router = express.Router();

//** AUTH ROUTES */
Router.post("/auth/register", UserController.registerUser);
Router.post("/auth/login", AuthController.login);
Router.get("/auth/profile", authentification, AuthController.getProfile);
Router.put("/auth/update/:id", authentification, UserController.updateUser);
Router.delete("/auth/update/:id", UserController.deleteUser);

//** UNIT ROUTES */
Router.post("/units/create", authentification, UnitController.createdUnit);
Router.put("/units/update/:id", authentification, UnitController.updateUnit);
Router.delete("/units/delete/:id", authentification, UnitController.deleteUnit);
Router.get("/units/all/", authentification, UnitController.getAll);
Router.get("/units/listting/", authentification, UnitController.Listting);

//** VENDOR ROUTES */
Router.post("/vendors/create", authentification, VendorController.createdVendor);
Router.put("/vendors/update/:id", authentification, VendorController.updateVendor);
Router.delete("/vendors/delete/:id", authentification, VendorController.deleteVendor);
Router.get("/vendors/all/", authentification, VendorController.getAll);
Router.get("/vendors/listting/", authentification, VendorController.Listting);

export { Router as Routes };