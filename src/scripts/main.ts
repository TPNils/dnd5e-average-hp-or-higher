interface Item5e extends Item {
  system: {
    [key: string]: any;
    hitDice?: `d${number}`;
  };
}
interface RollData {
  [key: string]: any;
  formula: string;
  data: ReturnType<Item['getRollData']>;
  chatMessage: boolean;
}

Hooks.on('dnd5e.preRollClassHitPoints', (actor: Actor, classItem: Item5e, rollData: RollData, messageData: Record<string, any>) => {
  if (!classItem.system.hitDice) {
    return;
  }
  const hd = Number(classItem.system.hitDice.substring(1));
  if (Number.isNaN(hd)) {
    return;
  }

  rollData.formula += `rr<${Math.ceil(hd / 2)+1}`;
})

Hooks.on('renderHitPointsFlow', (app: FormApplication, html: HTMLElement | JQuery, data: any) => {
  if (!(html instanceof HTMLElement)) {
    html = html[0];
  }
  const htmlButton = html.querySelector('button.rollButton');
  htmlButton.innerHTML = htmlButton.innerHTML.replace(data.hitDie, `${data.hitDie}rr<${Math.ceil(data.dieValue / 2)+1}`)
})