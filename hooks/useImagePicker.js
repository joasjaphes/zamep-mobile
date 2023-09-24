import { useCallback, useMemo, useState } from 'react';
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';

export default function useImagePicker() {
  const [image, setImage] = useState(null);

  const pickImage = useCallback(async (onChange) => {
    // No permissions request is necessary for launching the image library
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      if (onChange && typeof onChange === 'function') {
        onChange(result);
      }
    }
  }, []);

  const values = useMemo(() => ({
    image,
    pickImage,
  }), [image, pickImage]);

  return values;
}
