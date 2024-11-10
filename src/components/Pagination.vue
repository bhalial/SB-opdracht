<template>
    <div class="flex justify-center mt-6 pagination">
        <Button v-if="currentPage > 1" @click="goToPage(1)" variant="secondary">
            &laquo;
        </Button>
        <Button v-if="currentPage > 1" @click="goToPage(currentPage - 1)" variant="secondary">
            &lt;
        </Button>

        <!-- Page Number Buttons -->
        <Button v-for="page in pageNumbers" :key="page" @click="goToPage(page)"
            :variant="page === currentPage ? 'primary' : 'secondary'">
            {{ page }}
        </Button>

        <Button v-if="currentPage < totalPages" @click="goToPage(currentPage + 1)" variant="secondary">
            &gt;
        </Button>
        <Button v-if="currentPage < totalPages" @click="goToPage(totalPages)" variant="secondary">
            &raquo;
        </Button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Button from './Button.vue'; // Adjust the path if necessary

export default defineComponent({
    name: 'Pagination',
    components: {
        Button,
    },
    props: {
        currentPage: {
            type: Number,
            required: true,
        },
        totalItems: {
            type: Number,
            required: true,
        },
        itemsPerPage: {
            type: Number,
            required: true,
        },
        goToPage: {
            type: Function,
            required: true,
        },
    },
    computed: {
        totalPages() {
            return Math.ceil(this.totalItems / this.itemsPerPage);
        },
        pageNumbers() {
            const pages: number[] = [];
            const startPage = Math.max(1, this.currentPage - 2);
            const endPage = Math.min(this.totalPages, this.currentPage + 2);
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            return pages;
        },
    },
});
</script>