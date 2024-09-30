(function (Scratch) {
  "use strict";

  class CommentBlocks {
    constructor() {
      this.wi = 512;
      this.he = 512;
      this.step = 50;
      this.seed = -1;
      this.cfgsac = 7;
      this.strengths = 0.7;
      this.samplers = "DPM++ SDE Karras";
    }

    getInfo() {
      const defaultValue = Scratch.translate({
        default: "comment",
        description: "Default comment value",
      });
      return {
        id: "lmscomments",
        name: Scratch.translate("image generation"),
        color1: "#e4db8c",
        color2: "#c6be79",
        color3: "#a8a167",
        blocks: [
	  {
	    blockType: "label",
    	    text: "prompt",
          },
	  {
            opcode: "genPrompt",
            blockType: Scratch.BlockType.REPORTER,
            text: "Strengthen the [prompt]",
            allowDropAnywhere: true,
            arguments: {
              prompt: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "AI, future, technology",
              },
            },
          },
	{
	  blockType: "label",
	  text: "image generation",
	},
          {
            opcode: "size",
            blockType: Scratch.BlockType.COMMAND,
            text: "height：[wi] width：[he]",
            arguments: {
              wi: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 512,
              },
              he: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 512,
              },
            },
          },
          {
            opcode: "steps",
            blockType: Scratch.BlockType.COMMAND,
            text: "step：[stepm]",
            arguments: {
              stepm: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50,
              },
            },
          },
          {
            opcode: "seeds",
            blockType: Scratch.BlockType.COMMAND,
            text: "seed(random:-1)：[seedm]",
            arguments: {
              seedm: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 4389,
              },
            },
          },
          {
            opcode: "cfgsa",
            blockType: Scratch.BlockType.COMMAND,
            text: "Classifier Free Guidance scale：[cfgsa]",
            arguments: {
              cfgsa: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 7,
              },
            },
          },
          {
            opcode: "strength",
            blockType: Scratch.BlockType.COMMAND,
            text: "strength：[strength]",
            arguments: {
              strength: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.7,
              },
            },
          },
          {
            opcode: "sampler",
            blockType: Scratch.BlockType.COMMAND,
            text: "sampler：[samplerms]",
            arguments: {
              samplerms: {
                type: Scratch.ArgumentType.STRING,
                menu: "samplerm",
                defaultValue: "DPM++ SDE Karras",
              },
            },
          },
          {
            opcode: "genImage",
            blockType: Scratch.BlockType.REPORTER,
            text: "prompt: [prompt] outputFormat: [outputFormat]",
            allowDropAnywhere: true,
            arguments: {
              prompt: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "AI, future, ,technology, light blue, blue, 3d, 4k, 8k, 16k, 32k",
              },
              outputFormat: {
                type: Scratch.ArgumentType.STRING,
                menu: "outputFormatMenu",
                defaultValue: "dataURL",
              },
            },
          },
{
  opcode: "getSettings",
  blockType: Scratch.BlockType.REPORTER,
  text: "get setting (json)",
},
        ],
        menus: {
          outputFormatMenu: [
            { text: "dataURL", value: "dataURL" },
            { text: "blobURL", value: "blobURL" },
	    { text: "fetchURL", value: "fetchURL" },
          ],
	  samplerm: {
acceptReporters: true,
items:[
    { text: "DPM++ 2M", value: "DPM++ 2M" },
    { text: "DPM++ 2S a", value: "DPM++ 2S a" },
    { text: "DPM2", value: "DPM2" },
    { text: "DPM2 a", value: "DPM2 a" },
    { text: "LMS", value: "LMS" },
    { text: "DPM fast", value: "DPM fast" },
    { text: "DPM adaptive", value: "DPM adaptive" },
    { text: "DDIM", value: "DDIM" },
    { text: "PLMS", value: "PLMS" },
    { text: "LMS Karras", value: "LMS Karras" },
    { text: "DPM2 Karras", value: "DPM2 Karras" },
    { text: "DPM2 a Karras", value: "DPM2 a Karras" },
    { text: "DPM++ 2S a Karras", value: "DPM++ 2S a Karras" },
    { text: "DPM++ SDE", value: "DPM++ SDE" },
    { text: "DPM++ 2M Karras", value: "DPM++ 2M Karras" },
    { text: "DPM++ SDE Karras", value: "DPM++ SDE Karras" },
    { text: "Euler", value: "Euler" },
    { text: "Heun", value: "Heun" },
],
},
        },
      };
    }

    async genPrompt(args) {
      const url = `https://soiz-prompt.hf.space/?text=${encodeURIComponent(args.prompt)}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.result || "No results were obtained";
      } catch (error) {
        console.error('Error fetching data:', error);
        return "ERROR";
      }
    }

    async genImage(args) {
      const url = `https://soiz-imgen-api.hf.space/?prompt=${encodeURIComponent(args.prompt)}&steps=${this.step}&width=${this.wi}&height=${this.he}&is_negative=true&seed=${this.seed}&cfg_scale=${this.cfgsac}&strength=${this.strengths}&sampler=${encodeURIComponent(this.samplers)}`;

if(args.outputFormat==="fetchURL"){ return url }else{

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          return data.result || "No results were obtained";
        } else if (contentType && contentType.includes("image/")) {
          const blob = await response.blob();
          if (args.outputFormat === "dataURL") {
            const dataUrl = await this.blobToDataURL(blob);
            return dataUrl;
          } else if (args.outputFormat === "blobURL") {
            return URL.createObjectURL(blob);
          }
        } else {
          throw new Error("Unexpected content type");
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        return "ERROR";
      }
}
    }

    // Helper function to convert Blob to Data URL
    blobToDataURL(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    size(args) {
      this.wi = args.wi;
      this.he = args.he;
    }

    steps(args) {
      this.step = args.stepm;
    }

    seeds(args) {
      this.seed = args.seedm;
    }

    cfgsa(args) {
      this.cfgsac = args.cfgsa;
    }
    strength(args) {
      this.strengths = args.strength;
    }
    sampler(args) {
    this.samplers=args.samplerms;
    }
async getSettings() {
  return JSON.stringify({
    width: this.wi,
    height: this.he,
    step: this.step,
    seed: this.seed,
    cfg_scale: this.cfgsac,
    strength: this.strengths,
    sampler: this.samplers,
  });
}

  }

  Scratch.extensions.register(new CommentBlocks());
})(Scratch);
