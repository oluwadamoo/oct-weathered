export const debounce = <F extends (...args: any[]) => any>(func: F, delay: number) => {
    let timer: NodeJS.Timeout;
    return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
        const context = this;
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
};