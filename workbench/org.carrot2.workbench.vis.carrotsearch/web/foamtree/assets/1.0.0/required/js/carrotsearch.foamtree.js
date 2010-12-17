/*!
 * Carrot Search FoamTree JavaScript API. 
 * 
 * Copyright 2002-2010, Carrot Search s.c.
 * 
 * This file is licensed under Apache License 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0
 */
/*
 * This uncompressed code requires carrotsearch.visualization.js to work. 
 * The compressed version provided in carrotsearch.foamtree.min.js has no
 * dependencies, it already contains carrotsearch.visualization.js.
 */
/**
 * @constructor
 */
function CarrotSearchFoamTree(settings) {
  // Delegate that handles common API features
  var visualization = new CarrotSearchVisualization();

  visualization.init({
    visualizationName: "Carrot Search FoamTree",
    
    settings: settings,
    
    defaults: {
      id: "foamtree",
      width: "100%",
      height: "100%",
  
      flashPlayerInstallerSwfLocation: "swf/playerProductInstall.swf",
      visualizationSwfLocation: "FoamTree.swf",
  
      logo: "carrot2",
      
      dataUrl: null,
      dataXml: null,
      logging: false,
      forceRenderEvent: true,

      backgroundColor: "ff000000",

      groupColorModel: "gradient",
      
      gradientStartColor: "1.0, 0, 1, 0.9",
      gradientEndColor: "1.0, 0.83, 1, 0.5",
      gradientLabelDarkColor: "ff101010",
      gradientLabelLightColor: "ffe0e0e0",
      gradientLabelColorThreshold: 0.35,
      
      paletteGroupColors: ["ffdddddd", "ff333333"],
      paletteLabelColors: ["ff000000", "ffffffff"],
      
      customColorCallback: null,

      groupHoverColor:            "40ffffff",
      groupSelectionColor:        "80ffffff",
      groupSelectionOutlineColor: "d0ffffff",

      groupOverlayOpacity: 0.9,
      groupOverlayAnimationSpeed: 0.5,
      
      siblingBorderWidth: 1,
      outsideBorderWidth: 4,
      
      minFontSize: 2,
      maxFontSize: 72,
      
      maxLabelSizeForTitleBar: 12, 
      titleBarBackgroundColor: "b0000000",
      titleBarTextColor: "00ffffff",
      titleBarTextPaddingTopBottom: 15,
      titleBarTextPaddingLeftRight: 20,
      titleBarMinFontSize: 10,
      titleBarMaxFontSize: 40,
      
      stripHtmlFromLabels: false,
      
      groupSizeWeighting: "document-count",
      maxZeroScoreGroupSize: 0.1,
  
      performRelaxation: true,
      showLabelsDuringRelaxation: false,
      maxRelaxationSteps: 30,
      mapLayoutAlgorithm: "strip",
  
      onLoad: null,
      onInitialize: null,
      onModelChange: null,
      onGroupSelection: null,
      onGroupHover: null,
      onGroupOpenOrClose: null,

      wallSqueezeThreshold: 0.33
    },
    
    // TODO: are these supported and indeed reembeddingless?
    reembedinglessSettings: {
      dataUrl: true, 
      dataXml: true,
      selection: true
    },
    
    transformers: {
      backgroundColor: visualization.toHexString,
      
      groupColorModel: visualization.toFlashGroupColorModel,
      gradientLabelDarkColor: visualization.toHexString,
      gradientLabelLightColor: visualization.toHexString,
      paletteGroupColors: visualization.colorArrayToString,
      paletteLabelColors: visualization.colorArrayToString,
      customColorCallback: visualization.toCallbackWithTransformedResult(visualization.toHexString),
      
      groupHoverColor: visualization.toHexString,
      groupSelectionColor: visualization.toHexString,
      groupSelectionOutlineColor: visualization.toHexString,

      titleBarBackgroundColor: visualization.toHexString,
      titleBarTextColor: visualization.toHexString,

      logging: visualization.negate,
      onInitialize: visualization.toCallbackOnThisVisualization,
      onModelChange: visualization.toCallbackOnThisVisualization,
      onGroupSelection: visualization.toCallbackOnThisVisualization,
      onGroupHover: visualization.toCallbackOnThisVisualization,
      onGroupOpenOrClose: visualization.toCallbackOnThisVisualization
    },
    
    jsToSwfPropertyName: {
      forceRenderEvent: "forceRenderEvent",
      logo: "logo",

      backgroundColor: "gui_backgroundColor",
      
      onInitialize: "callback_onInitialized",
      onModelChange: "callback_onModelChanged",
      onGroupSelection: "callback_onGroupSelection",
      onGroupHover: "callback_onGroupHover",
      onGroupOpenOrClose: "callback_onGroupOpenOrClosed",
  
      dataUrl: "startup_data_URL",
      logging: "disableLogging",
  
      groupColorModel: "gui_colorModel",
      
      gradientStartColor: "gui_hsv_start",
      gradientEndColor: "gui_hsv_end",
      gradientLabelDarkColor: "gui_hsv_text_dark",
      gradientLabelLightColor: "gui_hsv_text_light",
      gradientLabelColorThreshold: "gui_hsv_text_bw_threshold",
      
      paletteGroupColors: "gui_palette_nodes",
      paletteLabelColors: "gui_palette_labels",
      
      customColorCallback: "callback_colorModel",

      groupHoverColor: "gui_hoverColor",
      groupSelectionColor: "gui_selectionColor",
      groupSelectionOutlineColor: "gui_selectedGroupOutline",
      
      groupOverlayOpacity: "groupOverlayOpaqueness",
      groupOverlayAnimationSpeed: "drillFadeSpeed",
      
      siblingBorderWidth: "siblingBorderWidth",
      outsideBorderWidth: "outsideBorderWidth",
      
      minFontSize: "minFontSize",
      maxFontSize: "maxFontSize",

      maxLabelSizeForTitleBar: "minLineHeightForTitleBar", 
      titleBarBackgroundColor: "gui_titleBarColor",
      titleBarTextColor: "gui_titleBarTextColor",
      titleBarTextPaddingTopBottom: "gui_titleBarPaddingV",
      titleBarTextPaddingLeftRight: "gui_titleBarPaddingH",
      titleBarMinFontSize: "gui_titleBarMinFontSize",
      titleBarMaxFontSize: "gui_titleBarMaxFontSize",

      stripHtmlFromLabels: "stripHtmlFromLabels",
      
      groupSizeWeighting: "weightFunction",
      maxZeroScoreGroupSize: "maxNegativeSizeRatio",
      
      performRelaxation: "autostartRelaxation",
      showLabelsDuringRelaxation: "labelsDuringRelaxation",
      maxRelaxationSteps: "maxRelaxationSteps",
      mapLayoutAlgorithm: "mapLayoutAlgorithm",

      wallSqueezeThreshold: "wallSqueezeThreshold"
    }
  });
  
  function set() {
    visualization.set.apply(visualization, arguments);
  }
  
  function get() {
    return visualization.get.apply(visualization, arguments);
  }

  // Expose public methods
  this.get = get;
  this.set = set;
  
  // Perform initial embedding
  visualization.embed();
};
