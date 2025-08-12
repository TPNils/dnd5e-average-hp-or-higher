interface Item5e extends Item {
  system: {
    [key: string]: any;
    hitDice?: `d${number}`;
    hd?: {
      denomination?: `d${number}`;
    }
  };
}
interface RollData {
  [key: string]: any;
  formula: string;
  data: ReturnType<Item['getRollData']>;
  chatMessage: boolean;
}

Hooks.on('dnd5e.preRollClassHitPoints', (actor: Actor, classItem: Item5e, rollData: RollData, messageData: Record<string, any>) => {
  const hdDenomination = classItem.system.hitDice /* old dnd */ ?? classItem.system.hd?.denomination /* new dnd (tested with dnd 5.0.4) */
  if (!hdDenomination) {
    return;
  }
  const hd = Number(hdDenomination.substring(1));
  if (Number.isNaN(hd)) {
    return;
  }

  rollData.formula += `rr<${Math.ceil(hd / 2)+1}`;
})

Hooks.on('renderHitPointsFlow', (app: FormApplication, html: HTMLElement | JQuery, data: any) => {
  if (!(html instanceof HTMLElement)) {
    html = html[0];
  }

  // V1 application: button.rollButton
  let htmlButton = html.querySelector('button.rollButton');
  if (htmlButton) {
    htmlButton.innerHTML = htmlButton.innerHTML.replace(data.hitDie, `${data.hitDie}rr<${Math.ceil(data.dieValue / 2)+1}`)
  }

  // V2 application: button.roll-button
  htmlButton = html.querySelector('button.roll-button');
  if (htmlButton) {
    for (const attr of [`aria-label`, `data-tooltip`]) {
      if (htmlButton.hasAttribute(attr)) {
        htmlButton.setAttribute(attr, htmlButton.getAttribute(attr).replace(data.hitDie, `${data.hitDie}rr<${Math.ceil(data.dieValue / 2)+1}`))
      }
    }
  }
})