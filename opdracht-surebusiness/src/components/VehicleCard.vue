<template>
    <div @click="handleClick"
        class="bg-white rounded-lg flex flex-col gap-1 cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all w-full">
        <div>
            <span class="licence-nr mx-auto w-full">{{ vehicle[vehicleKeys[0]] }}</span>
        </div>
        <div class="px-4 py-2">
            <div class="text-gray-900 font-bold">
                {{ vehicle[vehicleKeys[2]] }} <span class="text-gray-400">/ </span>
                <span class="text-gray-700 text-semibold text-sm">{{ vehicle[vehicleKeys[3]] }}</span>
            </div>
            <div>
                <span class="text-gray-700 text-sm">{{ vehicle[vehicleKeys[1]] }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: 'VehicleCard',
    props: {
        vehicle: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const router = useRouter();

        const handleClick = () => {
            // Navigate to the vehicle detail page
            router.push({ name: 'VehicleDetail', params: { kenteken: props.vehicle.kenteken } });
        };

        // Get keys from the vehicle object and select the first four
        const vehicleKeys = Object.keys(props.vehicle).slice(0, 4);
        const formatKey = (key: string) => {
            return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
        };

        return {
            handleClick,
            vehicleKeys,
            formatKey,
        };
    },
});
</script>