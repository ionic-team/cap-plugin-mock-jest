# Capacitor Plugin Mocks with Jest

Mocking a plugin in a unit test can be a challenge. Most mocking libraries mock an object by wrapping a JavaScript proxy around the object. Capacitor plugins, however, are already set up as JavaScript proxies, and you cannot create a proxy of a proxy. To get around this when using Jest as your testing framework, <a href="https://jestjs.io/docs/manual-mocks" _target="blank">manual mocks</a> is typically used.

## The Manual Mocks

For this project, I am using two Capacitor plugins: `@capacitor/storage` and `@capacitor/toast`. To create manual mocks for these plugins, I create the following file structure at the root of the project:

```
.
|
+- __mocks__
| |
| +- @capacitor
|   |
|   +- storeage.ts
|   +- toast.ts
...
+- src
```

The code in these files create some simple stubs that I use within the tests. For example:

**storeage.ts**

```TypeScript
export const Storage = {
  async get(data: { key: string }): Promise<{ value: string | undefined }> {
    return { value: undefined };
  },

  async set(data: { key: string; value: string }): Promise<void> {},
  async clear(): Promise<void> {},
};
```

**toast.ts**

```TypeScript
export const Toast = {
  async show(data: {
    text: string;
    duration?: 'short' | 'long';
    position?: 'bottom' | 'center' | 'top';
  }): Promise<void> {},
};
```

As you can see, they do almost nothing, which is exactly what you want stubs to do.

When I want to have fine-grained control in my tests, I can create mocks on the stubs and have complete control over my tests. For example, here is a test for an `@ionic/vue` application that controls the return value for `Storage.get()`:

```TypeScript
  it("gets the first and last name", async () => {
    Storage.get = jest.fn().mockImplementation(
      async (data: { key: string }): Promise<{ value: string }> => {
        return data.key === "firstName"
          ? { value: "Jimmy" }
          : data.key === "lastName"
          ? { value: "Simms" }
          : { value: "unknown" };
      }
    );
    const w = mount(Home);
    await flushPromises();
    expect(w.vm.firstName).toEqual("Jimmy");
    expect(w.vm.lastName).toEqual("Simms");
  });
```

The combination of the Jest manual mocks and the standard Jest mocks provides this level of control.

## Conclusion

Adding manual mocks to provide stubs for the Capacitor plugins we are using helps to make our unit tests clean and maintainable.

Happy Testing, Everybody!! 🤓
