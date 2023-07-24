<script lang="ts">
  import StarIcon from '$lib/icons/StarIcon.svelte';

  let clazz: string = '';
  export { clazz as class };
  export let readOnly: boolean = false;
  export let rating: number = 0;
  export let takeaway: string = '';
  export let onChange: (rating: number) => void = () => {};

  let config = {
    readOnly,
    countStars: 5,
    range: {
      min: 0,
      max: 5,
      step: 1
    },
    score: rating,
    starConfig: {
      size: readOnly ? 17 : 20,
      fillColor: '#FACC14',
      strokeColor: '#000',
      unfilledColor: '#FFF',
      strokeUnfilledColor: '#000'
    }
  };
</script>

<div class={clazz}>
  <div class="flex items-center">
    <div class="relative flex items-center justify-center gap-2">
      <div class="relative">
        <div class="flex items-center justify-center gap-2">
          {#each Array(config.countStars) as star, id}
            {#if config.score == id}
              <StarIcon
                {id}
                starConfig={config.starConfig}
                fillPercentage={config.score - config.score}
              />
            {:else if config.score > id}
              <StarIcon {id} starConfig={config.starConfig} fillPercentage={1} />
            {:else}
              <StarIcon {id} starConfig={config.starConfig} fillPercentage={0} />
            {/if}
          {/each}
        </div>
        <input
          class="opacity-0 cursor-pointer absolute inset-0 h-full"
          class:hidden={readOnly}
          type="range"
          min={config.range.min}
          max={config.range.max}
          step={config.range.step}
          bind:value={config.score}
          on:change={() => onChange(config.score)}
        />
      </div>
    </div>
    <p class="ml-2 text-sm text-gray-700 dark:text-gray-400">{takeaway}</p>
  </div>
</div>
