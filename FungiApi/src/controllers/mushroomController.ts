// src/controllers/mushroomController.ts
import { RequestHandler } from "express";
import Mushroom from "../models/Mushroom";

// Create
export const createMushroom: RequestHandler = async (req, res) => {
  try {
    const m = await Mushroom.create(req.body);
    res.status(201).json(m);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

// Read all
export const getAllMushrooms: RequestHandler = async (_, res) => {
  const list = await Mushroom.find();
  res.json(list);
};

// Read one
export const getMushroomById: RequestHandler = async (req, res) => {
  const m = await Mushroom.findById(req.params.id);
  if (!m) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(m);
};

// Update
export const updateMushroom: RequestHandler = async (req, res) => {
  const m = await Mushroom.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(m);
};

// Delete
export const deleteMushroom: RequestHandler = async (req, res) => {
  await Mushroom.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};
