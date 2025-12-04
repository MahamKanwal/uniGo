import mongoose, {Schema} from "mongoose";
const busSchema = new Schema({
    busNumber: { type: String, required: true, unique: true},
    status: {type: String, required:true, enum:["active","inactive","maintenance"]},
    driverId:{type:Schema.Types.ObjectId,required:true,  ref:"User" },
},
{ timestamps: true }
);
const busModel = mongoose.model("Bus", busSchema);
export default busModel;