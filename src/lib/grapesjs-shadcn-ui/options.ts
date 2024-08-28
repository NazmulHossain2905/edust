import { EditorConfig } from "grapesjs";
import gsPluginBlocksBasic from "grapesjs-blocks-basic";
import gsPluginTuiImageEditor from "grapesjs-tui-image-editor";
import gsPluginExport from "grapesjs-plugin-export";
import gsPluginCustomCode from "grapesjs-custom-code";
import plugins from "./plugins";

const fetchImagesAndAddToAssetManager = async (editor) => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/v0/organizations/site/upload",
      {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }
    ); // Replace with your API endpoint
    const data = await response.json();
    const imageUrls = data?.data?.items.map((image) => image.src);
    if (imageUrls.length && editor) {
      const assetManager = editor.AssetManager;
      assetManager.add(imageUrls);
      assetManager.render();
    }
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

const options = (editorRef: any): EditorConfig => ({
  height: "100vh",
  storageManager: {
    type: "remote", // Storage type. Available: local | remote
    autosave: true, // Store data automatically
    autoload: true, // Autoload stored data on init
    stepsBeforeSave: 10, // If autosave is enabled, indicates how many changes are necessary before the store method is triggered
    options: {
      remote: {
        // Load project data
        urlLoad: `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v0/organizations/site`,
        onLoad: (result) => {
          const site_data = JSON.parse(result?.data?.site_data);
          fetchImagesAndAddToAssetManager(editorRef.current);
          return editorRef.current.loadProjectData(site_data);
        },

        // Store project data
        urlStore: `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v0/organizations/site`,
        fetchOptions: (opts) =>
          opts.method === "POST" ? { ...opts, method: "PATCH" } : opts,
        onStore: (data) => ({ site_data: JSON.stringify(data) }),
      },
    },
  },
  undoManager: { trackSelection: false },
  selectorManager: { componentFirst: true },
  assetManager: {
    autoAdd: true,
    assets: [
      "https://via.placeholder.com/350x250/78c5d6/fff",
      "https://via.placeholder.com/350x250/459ba8/fff",
    ],
    uploadFile: (e) => {
      const files = e.dataTransfer ? e.dataTransfer.files : e.target?.files;
      const formData = new FormData();
      formData.append("image", files[0]);

      fetch("http://localhost:3000/api/v0/organizations/site/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const image_path = data?.data.src;
          if (image_path) {
            const editor = editorRef?.current;
            if (editor) {
              const assetManager = editor?.AssetManager;
              assetManager.add([image_path]);
              assetManager.render();
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    },
  },
  panels: { defaults: [] }, // Avoid default panels

  // If you enable multiple pages options then you need this

  deviceManager: {
    devices: [
      {
        name: "Desktop",
        width: "",
        // widthMedia: "1024px",
      },
      {
        name: "Tablet",
        width: "768px",
        widthMedia: "768px",
      },
      // {
      //   name: "Mobile Landscape",
      //   width: "640px",
      //   widthMedia: "640px",
      // },
      {
        name: "Mobile Portrait",
        width: "375px",
        widthMedia: "375px",
      },
    ],
  },

  plugins: [
    gsPluginBlocksBasic,
    ...plugins,
    gsPluginTuiImageEditor,
    gsPluginExport,
    gsPluginCustomCode,
  ],
  pluginsOpts: {},
});
export default options;