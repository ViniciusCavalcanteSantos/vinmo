import {Input, InputProps} from "antd";
import {AsYouType, CountryCode, getCountries as getPhoneCountries} from "libphonenumber-js";
import {useSafeUser} from "@/contexts/UserContext";
import React, {useEffect, useRef, useState} from "react";

interface InputPhoneProps extends InputProps {
  defaultCountryCode?: CountryCode;
}

export default function InputPhone({defaultCountryCode, ...props}: InputPhoneProps) {
  const {value, onChange, ...restProps} = props;
  const safeUser = useSafeUser()

  const [displayValue, setDisplayValue] = useState<string>('');
  const [countryCode, setCountryCode] = useState<CountryCode>("US");
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (defaultCountryCode) {
      setCountryCode(defaultCountryCode);
      return;
    }

    if (safeUser?.user) {
      const countryCode =
        getPhoneCountries().includes(safeUser?.user?.address?.country as CountryCode)
          ? safeUser?.user?.address.country as CountryCode
          : "US"
      setCountryCode(countryCode);
    }
  }, [safeUser?.user, defaultCountryCode]);

  useEffect(() => {
    const formated = (new AsYouType(countryCode)).input(value?.toString() ?? '')
    setDisplayValue(formated)
  }, [value, countryCode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDisplayValue(input);

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    onChange?.({
      ...e,
      target: {...e.target, value: input.replace(/\D/g, "")},
    });

    typingTimeout.current = setTimeout(() => {
      const formatted = new AsYouType(countryCode).input(input);
      setDisplayValue(formatted);
    }, 300);
  };

  return (
    <Input maxLength={20} {...restProps} value={displayValue} onChange={handleChange}/>
  )
}