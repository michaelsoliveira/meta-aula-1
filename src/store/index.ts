import { DriverStore, LocationStore, MarkerData } from "@/types/type"
import { create } from "zustand"

export const useLocationStore = create<LocationStore>((set: any) => ({
    userLatitude: null,
    userLongitude: null,
    userAddress: null,
    destinationLatitude: null,
    destinationLongitude: null,
    destinationAddress: null,
    setUserLocation: ({
        latitude,
        longitude,
        address
    }: {
        latitude: number,
        longitude: number,
        address: string
    }) => {
        set(() => ({
            userLatitude: latitude,
            userLongitude: longitude,
            userAdress: address
        }));
        const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
        if (selectedDriver) clearSelectedDriver();
    },
    setDestinationLocation: ({
        latitude,
        longitude,
        address
    }: {
        latitude: number,
        longitude: number,
        address: string
    }) => {
        set(() => ({
            userLatitude: latitude,
            userLongitude: longitude,
            userAdress: address
        }));
        const { selectedDriver, clearSelectedDriver } = useDriverStore.getState();
        if (selectedDriver) clearSelectedDriver();
    }   
}));

export const useDriverStore = create<DriverStore>(((set: any) => ({
    drivers: [] as MarkerData[],
    selectedDriver: null,
    setSelectedDriver: (driverId: number) =>
        set(() => ({ selectedDriver: driverId })),
    setDrivers: (drivers: MarkerData[]) => set(() => ({ drivers })),
    clearSelectedDriver: () => set(() => ({ selectedDriver: null }))
})))