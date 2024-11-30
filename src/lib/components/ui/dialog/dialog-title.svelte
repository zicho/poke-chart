<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui';
  import { cn } from '$lib/utils.js';
  import { Separator } from '../separator';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: DialogPrimitive.TitleProps = $props();
</script>

<DialogPrimitive.Title
  bind:ref
  class={cn(
    'mb-2 text-xl font-semibold leading-none tracking-tight',
    className
  )}
  {...restProps}
/>
<Separator />
