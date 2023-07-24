<script lang="ts">
  interface DropdownInputOptions {
    label: string;
    value: string;
  }

  let clazz: string = '';
  export { clazz as class };
  export let label: string = '';
  export let options: Array<DropdownInputOptions> = [];
</script>

<div class={clazz}>
  <label for={label} class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >{label}</label
  >
  <select
    id={label}
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
  >
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>
</div>
