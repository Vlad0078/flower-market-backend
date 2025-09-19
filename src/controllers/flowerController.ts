import { RequestHandler } from "express";
import translationConfig from "../config/translationConfig";
import FlowerModel from "../models/FlowerModel";
import UserModel from "../models/UserModel";

const defaultLang = translationConfig.defaultLang;

interface GetFlowersRequestParams {
  storeId: string;
  query?: string;
  sort?: "price" | "date";
  sortOrder?: "1" | "-1";
}

const getFlowers: RequestHandler<{}, {}, {}, GetFlowersRequestParams> = async (req, res) => {
  const { storeId, query, sort, sortOrder } = req.query;
  const lang = req.headers["accept-language"]?.split(",")[0] || defaultLang;

  const sortCondition: Record<string, 1 | -1> = {};
  sortCondition[sort === "price" ? "price" : "createdAt"] = sortOrder
    ? (Number(sortOrder) as -1 | 1)
    : -1;

  try {
    const flowers = await FlowerModel.find({
      storeId,
      $or: [
        { "name.uk": { $regex: query ?? "", $options: "i" } },
        { "name.en": { $regex: query ?? "", $options: "i" } },
        { "description.uk": { $regex: query ?? "", $options: "i" } },
        { "description.en": { $regex: query ?? "", $options: "i" } },
      ],
    })
      .sort(sortCondition)
      .lean();

    const flowersTranslated = flowers.map((flower) => ({
      ...flower,
      name: flower.name[lang] ?? flower.name[defaultLang],
      description: flower.description[lang] ?? flower.description[defaultLang],
    }));

    res.setHeader("Content-Language", lang);
    res.status(200).json({ flowers: flowersTranslated });
  } catch (error) {
    console.error("Could not get flowers:", error instanceof Error ? error.stack : error);
    res.status(500).json({ message: "Could not get flowers" });
  }
};

const getFlowersByIds: RequestHandler<{}, {}, { ids: string[] }> = async (req, res) => {
  const { ids } = req.body;

  const lang = req.headers["accept-language"]?.split(",")[0] || defaultLang;

  try {
    const flowers = await FlowerModel.find({ _id: { $in: ids } }).lean();

    const flowersTranslated = flowers.map((flower) => ({
      ...flower,
      name: flower.name[lang] ?? flower.name[defaultLang],
      description: flower.description[lang] ?? flower.description[defaultLang],
    }));

    res.setHeader("Content-Language", lang);
    res.status(200).json({ flowers: flowersTranslated });
  } catch (error) {
    console.error("Could not get flowers:", error instanceof Error ? error.stack : error);
    res.status(500).json({ message: "Could not get flowers" });
  }
};

const addFlower: RequestHandler = async (req, res) => {
  const { flower } = req.body;

  try {
    const newFlower = new FlowerModel(flower);
    await newFlower.save();
    res.status(200).json({ message: "Flower added" });
  } catch (error) {
    console.error("Could not add flower:", error instanceof Error ? error.stack : error);
    res.status(500).json({ message: "Could not add flower" });
  }
};

const addFlowerToFav: RequestHandler = async (req, res) => {
  const userId = req.userId;
  const { flowerId } = req.body;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    const isFav = user.favoriteFlowers.some((id) => id.toString() === flowerId);

    if (isFav) {
      user.favoriteFlowers = user.favoriteFlowers.filter((id) => id.toString() !== flowerId);
    } else {
      user.favoriteFlowers.push(flowerId);
    }

    await user.save();

    res.status(200).json({
      message: isFav ? "Flower removed from favorites" : "Flower added to favorites",
      favoriteFlowers: user.favoriteFlowers,
    });
  } catch (error) {
    console.error("Could not toggle flower:", error instanceof Error ? error.stack : error);
    res.status(500).json({ message: "Could not toggle flower" });
  }
};

const getFavoriteFlowers: RequestHandler = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await UserModel.findById(userId, { favoriteFlowers: 1 }).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ favoriteFlowers: user.favoriteFlowers });
  } catch (error) {
    console.error("Could not get favorites:", error instanceof Error ? error.stack : error);
    res.status(500).json({ message: "Could not get favorites" });
  }
};

export { getFlowers, getFlowersByIds, addFlower, addFlowerToFav, getFavoriteFlowers };
