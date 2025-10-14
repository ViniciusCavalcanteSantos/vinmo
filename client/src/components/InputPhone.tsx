import {Input, InputProps} from "antd";
import {AsYouType, CountryCode, getCountries as getPhoneCountries} from "libphonenumber-js";
import {useUser} from "@/contexts/UserContext";
import React, {useEffect, useRef, useState} from "react";

interface InputPhoneProps extends InputProps {
}

export default function InputPhone(props: InputPhoneProps) {
  const {value, onChange, ...restProps} = props;
  const {user} = useUser()

  const [displayValue, setDisplayValue] = useState<string>('');
  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const countryCode =
      getPhoneCountries().includes(user?.address.country as CountryCode)
        ? user?.address.country as CountryCode
        : "US"
    setCountryCode(countryCode);
  }, [user?.address.country]);

  useEffect(() => {
    const formated = (new AsYouType(countryCode)).input(value?.toString() ?? '')
    setDisplayValue(formated)
  }, [value, countryCode])


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDisplayValue(input);

    // Cancela formatações enquanto digita
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