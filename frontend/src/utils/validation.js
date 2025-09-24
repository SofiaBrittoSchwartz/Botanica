import { useCallback } from "react";
import { debounce } from 'lodash';

export const useDebounceValidation = (setValue, reValidatePasswordsMatch) => {
    return useCallback(
        debounce((name, value) => {
            setValue(name, value, { shouldValidate: true });
            if (name === 'password' && reValidatePasswordsMatch) {
                reValidatePasswordsMatch();
            }
        }, 1000),
        []
    );
};