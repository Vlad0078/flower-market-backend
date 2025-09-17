import OrderModel, { OrderDocument } from "../models/OrderModel";
import { FlowerDocument } from "../models/FlowerModel";
import translationConfig from "../config/translationConfig";

interface GetOrderOptions {
  findBy: { [key: string]: any };
  lang?: string;
}

const defaultLang = translationConfig.defaultLang;

export async function fetchAndTranslateOrder({ findBy, lang = defaultLang }: GetOrderOptions) {
  const order = await OrderModel.findOne(findBy).populate("items.flowerId").lean();

  if (!order) {
    throw new Error("Order not found");
  }

  const orderTranslated = {
    ...order,
    items: (order.items as unknown as OrderDocument & { flowerId: FlowerDocument }[]).map(
      (item) => {
        const flowerTranslated = {
          ...item.flowerId,
          name: item.flowerId.name[lang] ?? item.flowerId.name[defaultLang],
          description: item.flowerId.description[lang] ?? item.flowerId.description[defaultLang],
        };

        const { flowerId, ...itemTranslated } = { ...item, flower: flowerTranslated };

        return itemTranslated;
      }
    ),
  };

  return orderTranslated;
}
