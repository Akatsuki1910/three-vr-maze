import * as PIXI from "pixi.js";

export const pixiTextInit = async () => {
  // PIXI.Assets.addBundle("fonts", {
  //   ich1Q: {
  //     src: "/fonts/ich1Q-hand-Regular.ttf",
  //     data: { family: "ich1Q" },
  //   },
  // });
  // await PIXI.Assets.loadBundle("fonts");
};

export const pixiText = (text: string) => {
  const style = new PIXI.TextStyle({
    // fontFamily: "ich1Q",
    fontSize: 29,
    fill: 0xffffff,
  });

  return new PIXI.Text({ text: text, style });
};
