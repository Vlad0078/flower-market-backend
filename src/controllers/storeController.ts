import { RequestHandler } from "express";
import translationConfig from "../config/translationConfig";
import StoreModel from "../models/storeModel";

const defaultLang = translationConfig.defaultLang;

const getStores: RequestHandler = async (req, res) => {
  const { query } = req.query;
  const lang = req.headers["accept-language"]?.split(",")[0] || defaultLang;

  try {
    const stores = await StoreModel.find({
      $or: [
        { "name.uk": { $regex: query ?? "", $options: "i" } },
        { "name.en": { $regex: query ?? "", $options: "i" } },
        { "address.uk": { $regex: query ?? "", $options: "i" } },
        { "address.en": { $regex: query ?? "", $options: "i" } },
      ],
    }).lean();

    const storesTranslated = stores.map((store) => ({
      ...store,
      name: store.name[lang] ?? store.name[defaultLang],
      address: store.address[lang] ?? store.address[defaultLang],
    }));

    res.setHeader("Content-Language", lang);
    res.status(200).json({ stores: storesTranslated });
  } catch (error) {
    console.error("Could not get stores:", error instanceof Error ? error.stack : error);
    res.status(500).json({ message: "Could not get stores" });
  }
};

const addStore: RequestHandler = async (req, res) => {
  const { store } = req.body;

  try {
    const newStore = new StoreModel(store);
    await newStore.save();
    res.status(200).json({ message: "Store added" });
  } catch (error) {
    console.error("Could not add store:", error instanceof Error ? error.stack : error);
    res.status(500).json({ message: "Could not add store" });
  }
};

export { getStores, addStore };
