<?php

use App\Models\FaceDetail;

function saveFaceDetailFromAws(array $awsFace, int $faceCropId): FaceDetail
{
    $detail = FaceDetail::updateOrCreate(
        ['face_crop_id' => $faceCropId],
        [
            'face_confidence' => $awsFace['Confidence'] ?? null,

            'age_low' => $awsFace['AgeRange']['Low'] ?? null,
            'age_high' => $awsFace['AgeRange']['High'] ?? null,

            'gender_value' => $awsFace['Gender']['Value'] ?? null,
            'gender_confidence' => $awsFace['Gender']['Confidence'] ?? null,

            'eye_direction_confidence' => $awsFace['EyeDirection']['Confidence'] ?? null,
            'eye_direction_pitch' => $awsFace['EyeDirection']['Pitch'] ?? null,
            'eye_direction_yaw' => $awsFace['EyeDirection']['Yaw'] ?? null,

            'pose_pitch' => $awsFace['Pose']['Pitch'] ?? null,
            'pose_roll' => $awsFace['Pose']['Roll'] ?? null,
            'pose_yaw' => $awsFace['Pose']['Yaw'] ?? null,

            'quality_brightness' => $awsFace['Quality']['Brightness'] ?? null,
            'quality_sharpness' => $awsFace['Quality']['Sharpness'] ?? null,

            'beard_value' => $awsFace['Beard']['Value'] ?? null,
            'beard_confidence' => $awsFace['Beard']['Confidence'] ?? null,
            'mustache_value' => $awsFace['Mustache']['Value'] ?? null,
            'mustache_confidence' => $awsFace['Mustache']['Confidence'] ?? null,
            'eyeglasses_value' => $awsFace['Eyeglasses']['Value'] ?? null,
            'eyeglasses_confidence' => $awsFace['Eyeglasses']['Confidence'] ?? null,
            'sunglasses_value' => $awsFace['Sunglasses']['Value'] ?? null,
            'sunglasses_confidence' => $awsFace['Sunglasses']['Confidence'] ?? null,
            'eyes_open_value' => $awsFace['EyesOpen']['Value'] ?? null,
            'eyes_open_confidence' => $awsFace['EyesOpen']['Confidence'] ?? null,
            'mouth_open_value' => $awsFace['MouthOpen']['Value'] ?? null,
            'mouth_open_confidence' => $awsFace['MouthOpen']['Confidence'] ?? null,
            'face_occluded_value' => $awsFace['FaceOccluded']['Value'] ?? null,
            'face_occluded_confidence' => $awsFace['FaceOccluded']['Confidence'] ?? null,
            'smile_value' => $awsFace['Smile']['Value'] ?? null,
            'smile_confidence' => $awsFace['Smile']['Confidence'] ?? null,

            'raw' => $awsFace,
        ]
    );

    // Emotions (replace simples)
    $detail->emotions()->delete();
    foreach (($awsFace['Emotions'] ?? []) as $i => $emo) {
        if (!isset($emo['Type'])) {
            continue;
        }
        $detail->emotions()->create([
            'type' => $emo['Type'],
            'confidence' => $emo['Confidence'] ?? null,
        ]);
    }

    // Landmarks (replace simples)
    $detail->landmarks()->delete();
    foreach (($awsFace['Landmarks'] ?? []) as $lm) {
        if (!isset($lm['Type'], $lm['X'], $lm['Y'])) {
            continue;
        }
        $detail->landmarks()->create([
            'type' => $lm['Type'],
            'x' => $lm['X'],
            'y' => $lm['Y'],
        ]);
    }

    return $detail;
}
