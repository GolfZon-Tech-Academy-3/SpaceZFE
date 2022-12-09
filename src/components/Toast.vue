<template>
    <div class="alert" role="alert">
        <div>
            {{message}}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        message: {
            type: String,
            required: true,
        }
    }
}
</script>

<style scoped>
.alert {
    position:fixed;
    background-color: white;
    z-index: 10000;
    width: 300px;
    height: 70px;
    top: 10px;
    right: 10px;
    display:flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    border-radius: 1em;
    color: red;
    border: 1px red solid;
}
</style>