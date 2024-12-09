import PickUpOrder from "../model/PickUpOrder.model.js";

export const createPickUpOrder = async (req, res) => {
  try {
    const { pickUpNumber, companyName } = req.body;
    // Check for required fields
    if (!pickUpNumber || !companyName) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // Create a new instance of the PickUpOrder model
    const pickUpOrder = new PickUpOrder({
      pickUpNumber: pickUpNumber,
      companyName: companyName,
    });

    // Save to the database and handle potential errors
    const pick = await pickUpOrder.save();

    // Successfully created order
    return res.status(201).json({ pick, message: "PickUpOrder created" });
  } catch (error) {
    // Handle errors
    return res
      .status(500)
      .json({ message: "Failed to create PickUpOrder", error: error.message });
  }
};

export const deletePickUpOrder = async (req, res) => {
  try {
    const pickUpOrderId = req.params.id;
    const pickUpOrder = await PickUpOrder.findById(pickUpOrderId);
    if (!pickUpOrder) {
      return res.status(404).json({ message: "PickUpOrder not found" });
    }
    await PickUpOrder.findByIdAndDelete(pickUpOrderId);
    res.json({ message: "PickUpOrder deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete PickUpOrder", error: error.message });
  }
};

export const getAllPickUpOrders = async (req, res) => {
  try {
    const pickUpOrders = await PickUpOrder.find({}).sort({ createdAt: -1 });
    if (!pickUpOrders) {
      return res.status(404).json({ message: "PickUpOrders not found" });
    }
    res.json(pickUpOrders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get PickUpOrders", error: error.message });
  }
};

export const updatePickUpOrder = async (req, res) => {
  try {
    const { status } = req.body;
    const pickUpOrderId = req.params.id;
    const pickUpOrder = await PickUpOrder.findById(pickUpOrderId);
    if (!pickUpOrder) {
      return res.status(404).json({ message: "PickUpOrder not found" });
    }
    const updateData = await PickUpOrder.findByIdAndUpdate(
      pickUpOrderId,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updateData) {
      return res.status(404).json({ message: "PickUpOrder failed to update" });
    }

    res
      .status(200)
      .json({ message: "PickUpOrder updated successfully", updateData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update PickUpOrder", error: error.message });
  }
};

export const updateAllPickUpOrder = async (req, res) => {
  try {
    const pickUpOrderId = req.params.id;
    const pickUpOrder = await PickUpOrder.findById(pickUpOrderId);
    if (!pickUpOrder) {
      return res.status(404).json({ message: "PickUpOrder not found" });
    }
    const allowedFields = ["pickUpNumber", "companyName"];
    const update = {};
    for (const field of allowedFields) {
      if (req.body[field]) {
        update[field] = req.body[field];
      }
    }

    const updateData = await PickUpOrder.findByIdAndUpdate(
      pickUpOrderId,
      update,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updateData) {
      return res.status(404).json({ message: "PickUpOrder failed to update" });
    }

    res
      .status(200)
      .json({ message: "PickUpOrder updated successfully", updateData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update PickUpOrder", error: error.message });
  }
};
