<?php

namespace App\Imports;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Validators\Failure;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class ProductsImport implements ToCollection, WithHeadingRow
{
    public $successCount = 0;
    public $errors = [];

    public function collection(Collection $rows)
    {
        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2; // +1 for 0-index, +1 for header row

            // Skip if name is empty
            if (empty($row['name'])) {
                continue;
            }

            // Validate status
            $status = strtolower($row['status'] ?? 'draft');
            if (!in_array($status, ['draft', 'published', 'archived'])) {
                $status = 'draft';
            }

            // Validate category_id exists if provided
            $categoryId = $row['category_id'] ?? null;
            if ($categoryId) {
                if (!Category::where('id', $categoryId)->exists()) {
                    $this->errors[] = [
                        'row' => $rowNumber,
                        'reason' => "Category ID {$categoryId} does not exist."
                    ];
                    continue;
                }
            }

            try {
                Product::create([
                    'name'            => $row['name'],
                    'slug'            => Str::slug($row['name']) . '-' . Str::random(5),
                    'description'     => $row['description'] ?? '',
                    'category_id'     => $categoryId,
                    'price'           => $row['price'] ?? 0,
                    'status'          => $status,
                    'is_featured'     => (bool)($row['is_featured'] ?? false),
                    'is_bestseller'   => (bool)($row['is_bestseller'] ?? false),
                    'is_eco_friendly' => (bool)($row['is_eco_friendly'] ?? false),
                    'is_new_arrival'  => (bool)($row['is_new_arrival'] ?? false),
                ]);
                $this->successCount++;
            } catch (\Exception $e) {
                $this->errors[] = [
                    'row' => $rowNumber,
                    'reason' => $e->getMessage()
                ];
            }
        }
    }

    public function getResults()
    {
        return [
            'imported' => $this->successCount,
            'failed' => count($this->errors),
            'errors' => $this->errors
        ];
    }
}
