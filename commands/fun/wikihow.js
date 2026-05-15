import { Base } from "oceanic.js";
import Command from "#cmd-classes/command.js";

class WikihowCommand extends Command {
  async run() {
    await this.acknowledge();
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 15000);
    try {
      //const req = await fetch("https://www.wikihow.com/api.php?action=query&generator=random&prop=imageinfo&format=json&iiprop=url&grnnamespace=6", { signal: controller.signal });
      //clearTimeout(timeout);
      //const json = await req.json();
      //const id = Object.keys(json.query.pages)[0];
      //const data = json.query.pages[id];
      //if (data.imageinfo) {
      //  return json.query.pages[id].imageinfo[0].url;
      //} else {
      //  return await this.run();
      //}

      const req = await fetch("https://www.wikihow.com/Special:Randomizer", { signal: controller.signal });
      clearTimeout(timeout);
      const regexp = /(?:https:\/\/www\.wikihow\.com)?\/images\/thumb\/([0-9a-f]\/[0-9a-f]{2}\/[^"' <]+?\.(?:jpg|jpeg|png|gif))(?:\/[^"' <]+)?(?:\s+\d+w)?/gi;
      const matches = Array.from((await req.text()).matchAll(regexp));
      return "https://www.wikihow.com/images/" + matches[Math.floor(Math.random() * matches.length)][1];
    } catch (e) {
      if (e.name === "AbortError") {
        this.success = false;
        return "I couldn't get a WikiHow image in time. Maybe try again?";
      } else if (e.name === "SyntaxError") {
        this.success = false;
        return "I couldn't get a WikiHow image. Something is probably wrong with their API. Maybe try again later?"
      }
    }
  }

  static description = "Gets a random WikiHow image";
  static aliases = ["wiki"];
}

export default WikihowCommand;
