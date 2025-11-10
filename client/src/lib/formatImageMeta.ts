import {ImageMeta} from "@/types/Image";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {TFunction} from "i18next";

dayjs.extend(customParseFormat);

export type FormattedMetaItem = {
  label: string;
  value: string;
};

function formatExposureProgram(value: string, t: TFunction): string {
  const valueNumber = Number(value);
  if (Number.isNaN(valueNumber) || valueNumber < 0 || valueNumber > 8) return t('image_meta.exposure_program.0');

  return t(`image_meta.exposure_program.${valueNumber}`)
}

function describeFlash(value: number, t: TFunction) {
  const FIRED_MASK = 0x01
  const AUTO_MASK = 0x08
  const REDEYE_MASK = 0x20

  const fired = (value & FIRED_MASK) !== 0;
  const auto = (value & AUTO_MASK) !== 0;
  const redEye = (value & REDEYE_MASK) !== 0;

  let text: string;
  if (fired) {
    text = auto ? t('image_meta.flash.fired_auto') : t('image_meta.flash.fired_forced');
  } else {
    text = auto ? t('image_meta.flash.not_fired_auto') : t('image_meta.flash.not_fired_forced');
  }

  if (redEye) text += ` ${t('image_meta.flash.red_eye')}`;

  return text;
}

// HELPERS
export function formatCapturedAt(dateStr?: string): string | undefined {
  if (!dateStr) return;

  const formats = [
    "YYYY:MM:DD HH:mm:ss", // EXIF
    "YYYY-MM-DD HH:mm:ss", // comum em JSON
    "YYYY-MM-DDTHH:mm:ssZ", // ISO 8601 com timezone
    "YYYY-MM-DDTHH:mm:ss", // ISO sem timezone
  ];

  let parsed: dayjs.Dayjs | null = null;

  for (const fmt of formats) {
    const d = dayjs(dateStr, fmt, true);
    if (d.isValid()) {
      parsed = d;
      break;
    }
  }

  if (!parsed) {
    const auto = dayjs(dateStr);
    if (auto.isValid()) parsed = auto;
  }

  if (!parsed) return dateStr;

  return parsed.format("DD/MM/YYYY HH:mm");
}


function parseFraction(value?: string): number | undefined {
  if (!value) return;
  const parts = value.split('/');
  if (parts.length === 2) {
    const num = parseFloat(parts[0]);
    const den = parseFloat(parts[1]);
    if (!isNaN(num) && !isNaN(den) && den !== 0) {
      return num / den;
    }
  }
  const num = parseFloat(value);
  return isNaN(num) ? undefined : num;
}

function formatFNumber(fNumber: string): string {
  const val = parseFraction(fNumber);
  return val ? `F${val.toFixed(1).replace(/\.0$/, '')}` : fNumber;
}

function formatFocalLength(focal: string): string {
  const val = parseFraction(focal);
  return val ? `${val.toFixed(1)} mm` : focal;
}


export function formatImageMeta(meta: ImageMeta, t: TFunction): FormattedMetaItem[] {
  const items: FormattedMetaItem[] = [];

  if (meta.camera?.model) {
    items.push({
      label: t('image_meta.camera_make'),
      value: meta.camera.model,
    });
  }

  if (meta.exposure?.exposureTime) {
    items.push({
      label: t('image_meta.exposure_time'),
      value: `${meta.exposure.exposureTime} s`,
    });
  }

  if (meta.exposure?.exposureProgram) {
    items.push({
      label: t('image_meta.exposure_program.name'),
      value: formatExposureProgram(meta.exposure.exposureProgram ?? '', t),
    });
  }

  if (meta.camera?.lens) {
    items.push({
      label: t('image_meta.lens'),
      value: meta.camera.lens,
    });
  }

  if (meta.exposure?.fNumber) {
    items.push({
      label: t('image_meta.aperture'),
      value: formatFNumber(meta.exposure.fNumber),
    });
  }

  if (meta.exposure?.iso) {
    items.push({
      label: t('image_meta.iso'),
      value: `${meta.exposure.iso}`,
    });
  }

  if (meta.exposure?.flash) {
    const flash = describeFlash(meta.exposure?.flash, t)
    items.push({
      label: t('image_meta.flash_fired'),
      value: flash ?? `Valor EXIF: ${meta.exposure.flash}`,
    });
  }

  if (meta.exposure?.focalLength) {
    items.push({
      label: t('image_meta.focal_length'),
      value: formatFocalLength(meta.exposure.focalLength),
    });
  }

  if (meta.camera?.software) {
    items.push({
      label: t('software', "Software"),
      value: meta.camera.software,
    });
  }

  if (meta.camera?.capturedAt) {
    items.push({
      label: t('image_meta.captured_on'),
      value: formatCapturedAt(meta.camera.capturedAt) ?? meta.camera.capturedAt,
    });
  }

  if (meta.location?.latitude) {
    items.push({
      label: t('latitude'),
      value: meta.location.latitude.toString(),
    });
  }
  if (meta.location?.longitude) {
    items.push({
      label: t('longitude'),
      value: meta.location.longitude.toString(),
    });
  }

  return items;
}