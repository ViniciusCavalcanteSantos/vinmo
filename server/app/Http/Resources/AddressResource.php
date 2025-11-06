<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *     schema="CityAreaAddress",
 *     type="object",
 *     required={"granularity", "country", "state", "city"},
 *     @OA\Property(property="granularity", type="string", enum={"city_area"}, example="city_area"),
 *     @OA\Property(property="countryName", type="string", example="Brasil"),
 *     @OA\Property(property="country", type="string", example="BR"),
 *     @OA\Property(property="stateName", type="string", example="Pernambuco"),
 *     @OA\Property(property="state", type="string", example="PE"),
 *     @OA\Property(property="city", type="string", example="Recife")
 * )
 *
 * @OA\Schema(
 *     schema="FullAddress",
 *     type="object",
 *     required={"granularity", "country", "state", "city", "street", "number", "neighborhood"},
 *     @OA\Property(property="granularity", type="string", enum={"full_address"}, example="full_address"),
 *     @OA\Property(property="countryName", type="string", example="Brasil"),
 *     @OA\Property(property="country", type="string", example="BR"),
 *     @OA\Property(property="stateName", type="string", example="Pernambuco"),
 *     @OA\Property(property="state", type="string", example="PE"),
 *     @OA\Property(property="city", type="string", example="Recife"),
 *     @OA\Property(property="postalCode", type="string", example="10001-1234"),
 *     @OA\Property(property="street", type="string", example="Rua das Flores"),
 *     @OA\Property(property="number", type="string", example="123"),
 *     @OA\Property(property="neighborhood", type="string", example="Centro"),
 *     @OA\Property(property="complement", type="string", nullable=true, example="Apto 201")
 * )
 *
 * @OA\Schema(
 *   schema="Address",
 *   oneOf={
 *     @OA\Schema(ref="#/components/schemas/CityAreaAddress"),
 *     @OA\Schema(ref="#/components/schemas/FullAddress")
 *   },
 *   discriminator={
 *     "propertyName": "granularity",
 *     "mapping": {
 *       "city_area": "#/components/schemas/CityAreaAddress",
 *       "full_address": "#/components/schemas/FullAddress"
 *     }
 *   }
 * )
 */
class AddressResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'granularity' => $this->granularity,
            'postalCode' => $this->postal_code ?? null,
            'street' => $this->street ?? null,
            'number' => $this->number ?? null,
            'neighborhood' => $this->neighborhood ?? null,
            'complement' => $this->complement ?? null,
            'city' => $this->city,
            'state' => $this->state,
            'stateName' => getStateName($this->country, $this->state),
            'country' => $this->country,
            'countryName' => getCountryName($this->country),
        ];
    }
}
