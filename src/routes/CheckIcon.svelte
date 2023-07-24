<script lang="ts">
  export let width: number = 20;
  export let height: number = 20;
  export let color: string = 'white';
  let clazz: string = '';
  export { clazz as class };
</script>

<svg class={clazz} {width} {height} viewBox="0 0 20 20">
  <path
    fill-rule="evenodd"
    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
    clip-rule="evenodd"
    fill={color}
  />
</svg>
