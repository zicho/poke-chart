<script lang="ts">
  import { Button } from './ui/button';
  import { Label } from './ui/label';

  type CounterProps = {
    label: string;
    currentVal: number;
    max: number;
    disableIncrement: boolean;
  };

  let {
    label,
    currentVal = $bindable(),
    max,
    disableIncrement,
  }: CounterProps = $props();

  const increment = () => {
    if (currentVal < max) {
      currentVal++;
    }
  };

  const decrement = () => {
    if (currentVal > 0) {
      currentVal--;
    }
  };
</script>

<div class="grid grid-cols-4 items-center gap-4">
  <Label>{label}</Label>
  <Button
    variant="default"
    onclick={decrement}
    disabled={currentVal === 0}
    class="w-full">-</Button
  >
  <Label class="text-center">{currentVal}</Label>
  <Button
    variant="default"
    onclick={increment}
    disabled={currentVal === max || disableIncrement}
    class="w-full">+</Button
  >
</div>
