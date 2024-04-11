import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { Model, PopulateOptions } from "mongoose";
import APIFeatures from "../utils/apiFeatures";

export const deleteOne = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError(404, "No document found with that ID"));
    }
    console.log("here");
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

export const updateOne = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(404, "No document found with that ID"));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const createOne = (Model: Model<any>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const getOne = (Model: Model<any>, popOptions?: PopulateOptions) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError(404, "No document found with that ID"));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

export const getAll = (
  Model: Model<any>,
  popOptions?: PopulateOptions,
  selectOptions?: string,
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // To allow for nested GET reviews on tour (hack)
    let filter: any = {};
    if (req.params.productId) filter = { product: req.params.productId };
    if (req.body.user) filter = { user: req.body.user };

    let query = Model.find(filter);

    if (selectOptions) query = query.select(selectOptions);
    if (popOptions) query = query.populate(popOptions);
    const features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .searchByTags()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;
    const count = await new APIFeatures(Model.find(filter), req.query)
      .filter()
      .searchByTags()
      .query.count();
    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: count,
      data: doc,
    });
  });
