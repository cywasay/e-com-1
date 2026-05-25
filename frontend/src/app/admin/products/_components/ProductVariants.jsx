"use client";
import { useState } from "react";
import { Plus, Trash2, GripVertical, Image as ImageIcon, Search, Filter } from "lucide-react";
import VariantEditModal from "./VariantEditModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProductVariants({ formData, setFormData, onGenerate, onRemoveVariant }) {
  const [editingVariant, setEditingVariant] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const addOptionType = () => {
    setFormData({ 
      ...formData, 
      optionTypes: [...formData.optionTypes, { name: "", values: "", isEditing: true }] 
    });
  };
  
  const updateOptionType = (idx, field, value) => {
    const newOT = [...formData.optionTypes];
    newOT[idx][field] = value;
    setFormData({ ...formData, optionTypes: newOT });
  };

  const removeOptionType = (idx) => {
    const newOT = formData.optionTypes.filter((_, i) => i !== idx);
    setFormData({ ...formData, optionTypes: newOT });
  };

  const toggleOptionEditing = (idx) => {
    setFormData(prev => {
      const newOT = [...prev.optionTypes];
      newOT[idx].isEditing = !newOT[idx].isEditing;
      return { ...prev, optionTypes: newOT };
    });
    setTimeout(() => onGenerate(), 10);
  };

  const updateVariant = (vIdx, field, value) => {
    const newV = [...formData.variants];
    newV[vIdx] = { ...newV[vIdx], [field]: value };
    setFormData({ ...formData, variants: newV });
  };

  const handleEditVariant = (variant, index) => {
    setEditingVariant({ ...variant, index });
    setModalOpen(true);
  };

  const saveVariantChanges = (updatedVariant) => {
    const index = updatedVariant.index;
    const { index: _, ...cleanVariant } = updatedVariant;
    const newV = [...formData.variants];
    newV[index] = cleanVariant;
    setFormData({ ...formData, variants: newV });
    setModalOpen(false);
  };

  const totalAvailable = formData.variants.reduce((acc, v) => acc + (parseInt(v.stock_qty) || 0), 0);

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Variants</h3>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <VariantEditModal 
          isOpen={modalOpen} 
          variant={editingVariant} 
          onClose={() => setModalOpen(false)} 
          onSave={saveVariantChanges} 
        />

        <div className="space-y-4">
          {formData.optionTypes.map((ot, idx) => (
            <div key={idx} className="border border-border rounded-lg p-5 relative bg-muted/30">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground/40">
                <GripVertical size={16} />
              </div>
              
              <div className="pl-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Option name</Label>
                  <Input
                    type="text"
                    value={ot.name}
                    onChange={(e) => updateOptionType(idx, "name", e.target.value)}
                    placeholder="e.g. Size"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Option values</Label>
                  <div className="space-y-2">
                    {ot.values.split(",").map((val, vIdx) => {
                      const trimmedVal = val.trim();
                      return (
                        <div key={vIdx} className="flex items-center gap-2 relative group">
                          <GripVertical size={14} className="text-muted-foreground/40 absolute left-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Input
                            type="text"
                            value={trimmedVal}
                            onChange={(e) => {
                              const newVals = ot.values.split(",");
                              newVals[vIdx] = e.target.value;
                              if (vIdx === newVals.length - 1 && e.target.value.trim() !== "") {
                                newVals.push("");
                              }
                              updateOptionType(idx, "values", newVals.join(","));
                            }}
                            onBlur={() => {
                              const vals = ot.values.split(",").map(v => v.trim()).filter(v => v !== "");
                              if (vals.length > 0) {
                                updateOptionType(idx, "values", [...vals, ""].join(","));
                              }
                            }}
                            className="pl-10 pr-10"
                            placeholder={vIdx === ot.values.split(",").length - 1 ? "Add another value" : ""}
                          />
                          {trimmedVal !== "" && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => {
                                const newVals = ot.values.split(",").filter((_, i) => i !== vIdx);
                                updateOptionType(idx, "values", newVals.join(","));
                              }}
                              className="absolute right-1 text-muted-foreground hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button type="button" variant="destructive" onClick={() => removeOptionType(idx)} className="text-sm">
                    Delete
                  </Button>
                  <Button type="button" onClick={() => toggleOptionEditing(idx)}>
                    Done
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <Button type="button" variant="link" onClick={addOptionType} className="text-accent font-medium text-sm h-auto p-0">
            <Plus size={18} className="bg-accent/10 rounded-full p-0.5" />
            Add another option
          </Button>
        </div>

        {formData.variants.length > 0 && (
          <div className="pt-6 border-t border-border space-y-4">
            <div className="flex items-center justify-end gap-2 mb-2">
              <Button variant="outline" size="icon-sm"><Search size={16} /></Button>
              <Button variant="outline" size="icon-sm"><Filter size={16} /></Button>
            </div>

            <Card className="overflow-hidden py-0 shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-10 text-center">
                      <Checkbox aria-label="Select all variants" />
                    </TableHead>
                    <TableHead className="font-medium text-muted-foreground">Variant</TableHead>
                    <TableHead className="font-medium text-muted-foreground text-right">Price</TableHead>
                    <TableHead className="font-medium text-muted-foreground text-right">Available</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formData.variants.map((v, vIdx) => (
                    <TableRow key={vIdx}>
                      <TableCell className="text-center">
                        <Checkbox aria-label={`Select variant ${vIdx + 1}`} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div 
                            onClick={() => handleEditVariant(v, vIdx)}
                            className="w-10 h-10 bg-muted border border-border rounded-lg flex items-center justify-center text-muted-foreground/40 group cursor-pointer relative overflow-hidden hover:border-border transition-all"
                          >
                            <ImageIcon size={18} />
                            <div className="absolute inset-0 bg-primary/0 hover:bg-primary/5 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                              <Plus size={14} className="text-muted-foreground" />
                            </div>
                          </div>
                          <span 
                            onClick={() => handleEditVariant(v, vIdx)}
                            className="font-medium text-foreground cursor-pointer hover:text-accent hover:underline decoration-accent/50 underline-offset-4 transition-all"
                          >
                            {Object.values(v.options).join(" / ")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="relative inline-block max-w-[120px]">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">Rs</span>
                          <Input
                            type="number"
                            step="0.01"
                            value={v.price ?? ""}
                            onChange={(e) => updateVariant(vIdx, "price", e.target.value)}
                            className="pl-8 text-right"
                            placeholder="0.00"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          value={v.stock_qty ?? 0}
                          onChange={(e) => updateVariant(vIdx, "stock_qty", e.target.value)}
                          className="w-20 text-right inline-block"
                          placeholder="0"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="px-4 py-3 bg-muted/50 text-xs text-muted-foreground font-medium">
                Total inventory at Shop location: {totalAvailable} available
              </div>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
