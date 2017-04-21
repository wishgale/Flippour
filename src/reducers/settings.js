const initialState = {
  theme: "Light",
  themeOptions: ["Dark", "Light", "Oceanic", "Solarized"],
  username: "",
  soundsEnabled: true
};

export const SettingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SAVE_SETTINGS": {
      console.log(Object.assign({}, state, action.payload));
      return Object.assign({}, state, action.payload);
    }

    default: {
      return state;
    }
  }
};
