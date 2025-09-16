import { RequestHandler } from "express";
import translationConfig from "../config/translationConfig";
import FlowerModel from "../models/FlowerModel";

const defaultLang = translationConfig.defaultLang;

const getFlowers: RequestHandler = async (req, res) => {
  const { storeId, query } = req.query;
  const lang = req.headers["accept-language"]?.split(",")[0] || defaultLang;

  try {
    const flowers = await FlowerModel.find({
      storeId,
      $or: [
        { "name.uk": { $regex: query ?? "", $options: "i" } },
        { "name.en": { $regex: query ?? "", $options: "i" } },
        { "description.uk": { $regex: query ?? "", $options: "i" } },
        { "description.en": { $regex: query ?? "", $options: "i" } },
      ],
    }).lean();

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

export { getFlowers, addFlower };
