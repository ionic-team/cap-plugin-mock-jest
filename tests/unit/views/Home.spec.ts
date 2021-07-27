import { flushPromises, mount, VueWrapper } from "@vue/test-utils";
import { Storage } from "@capacitor/storage";
import { Toast } from "@capacitor/toast";
import Home from "@/views/Home.vue";

describe("Home.vue", () => {
  let wrapper: VueWrapper<any>;
  beforeEach(() => {
    wrapper = mount(Home);
  });

  afterEach(jest.clearAllMocks);

  it("displays the title", () => {
    const titles = wrapper.findAllComponents("ion-title");
    expect(titles).toHaveLength(1);
    expect(titles[0].text()).toBe("Plugins Sample");
  });

  it("gets the first and last name", async () => {
    Storage.get = jest
      .fn()
      .mockImplementation(
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

  describe("save", () => {
    it("is disabled until a first and last name have been entered", async () => {
      const button = wrapper.findComponent('[data-testid="save"]');
      const firstName = wrapper.findComponent('[data-testid="firstName"]');
      const lastName = wrapper.findComponent('[data-testid="lastName"]');

      await firstName.setValue("");
      await lastName.setValue("");
      expect(button.attributes().disabled).toBe("true");

      await firstName.setValue("The");
      expect(button.attributes().disabled).toBe("true");

      await lastName.setValue("Dude");
      expect(button.attributes().disabled).toBe("false");
    });

    it("Storage the first and last names", async () => {
      const button = wrapper.findComponent('[data-testid="save"]');
      const firstName = wrapper.findComponent('[data-testid="firstName"]');
      const lastName = wrapper.findComponent('[data-testid="lastName"]');

      Storage.set = jest.fn().mockResolvedValue(undefined);

      await firstName.setValue("The Dude");
      await lastName.setValue("Abides");
      button.trigger("click");

      expect(Storage.set).toHaveBeenCalledTimes(2);
      expect(Storage.set).toHaveBeenCalledWith({
        key: "firstName",
        value: "The Dude",
      });
      expect(Storage.set).toHaveBeenCalledWith({
        key: "lastName",
        value: "Abides",
      });
    });
  });

  describe("clear", () => {
    beforeEach(async () => {
      const firstName = wrapper.findComponent('[data-testid="firstName"]');
      const lastName = wrapper.findComponent('[data-testid="lastName"]');
      await firstName.setValue("The Dude");
      await lastName.setValue("Abides");
    });

    it("clears the storage", () => {
      const button = wrapper.findComponent('[data-testid="clear"]');
      Storage.clear = jest.fn().mockResolvedValue(undefined);
      button.trigger("click");
      expect(Storage.clear).toHaveBeenCalledTimes(1);
    });

    it("clears the firstName", () => {
      const button = wrapper.findComponent('[data-testid="clear"]');
      button.trigger("click");
      expect(wrapper.vm.firstName).toBe("");
    });

    it("clears the lastName", () => {
      const button = wrapper.findComponent('[data-testid="clear"]');
      button.trigger("click");
      expect(wrapper.vm.lastName).toBe("");
    });
  });

  describe("saying Hello", () => {
    it("is disabled until a first and last name have been entered", async () => {
      const button = wrapper.findComponent('[data-testid="hello"]');
      const firstName = wrapper.findComponent('[data-testid="firstName"]');
      const lastName = wrapper.findComponent('[data-testid="lastName"]');

      await firstName.setValue("");
      await lastName.setValue("");
      expect(button.attributes().disabled).toBe("true");

      await firstName.setValue("The");
      expect(button.attributes().disabled).toBe("true");

      await lastName.setValue("Dude");
      expect(button.attributes().disabled).toBe("false");
    });

    it("shows toast when clicked", async () => {
      const firstName = wrapper.findComponent('[data-testid="firstName"]');
      const lastName = wrapper.findComponent('[data-testid="lastName"]');
      const button = wrapper.findComponent('[data-testid="hello"]');

      Toast.show = jest.fn().mockResolvedValue(undefined);

      await firstName.setValue("The");
      await lastName.setValue("Dude");
      button.trigger("click");

      expect(Toast.show).toHaveBeenCalledTimes(1);
      expect(Toast.show).toHaveBeenCalledWith({ text: "Hello The Dude" });
    });
  });
});
