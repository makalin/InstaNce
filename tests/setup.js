// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn(key => store[key]),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: jest.fn(() => {
            store = {};
        }),
        removeItem: jest.fn(key => {
            delete store[key];
        })
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock URL.createObjectURL
window.URL.createObjectURL = jest.fn();
window.URL.revokeObjectURL = jest.fn(); 