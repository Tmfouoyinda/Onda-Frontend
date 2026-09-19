declare module "react-native-country-codes-picker" {
  import type { ComponentType } from "react";

  export type CountryCodeItem = {
    code: string;
    dial_code: string;
    name?: string;
    flag?: string;
  };

  export type CountryPickerProps = {
    show: boolean;
    lang?: string;
    showOnly?: string[];
    excludedCountries?: string[];
    popularCountries?: string[];
    initialState?: string;
    inputPlaceholder?: string;
    searchMessage?: string;
    disableBackdrop?: boolean;
    enableModalAvoiding?: boolean;
    androidWindowSoftInputMode?: string;
    pickerButtonOnPress: (item: CountryCodeItem) => void;
    onBackdropPress?: (...args: any) => any;
    onRequestClose?: (...args: any) => any;
  };

  export const CountryPicker: ComponentType<CountryPickerProps>;
}
