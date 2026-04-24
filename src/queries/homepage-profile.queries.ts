import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";

import type { 
    HomepageProfileCreateRequest, 
    HomepageProfileUpdateRequest
 } from "@/types/homepage-profile.types";

import {
    getHomepageProfile,
    createHomepageProfile,
    updateHomepageProfile,
} from "@/api/homepage-profile.api";

export const homepageProfileKeys = {
    root: () => ["homepageProfile"] as const,
};

export const useHomepageProfileQuery = () => {
    return useQuery({
        queryKey: homepageProfileKeys.root(),
        queryFn: () => getHomepageProfile(),
    });
}

export const useCreateHomepageProfileMutation = () => {
    return useMutation({
        mutationFn: (data: HomepageProfileCreateRequest) => createHomepageProfile(data),    
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: homepageProfileKeys.root() });
        }
    });
}

export const useUpdateHomepageProfileMutation = () => {
    return useMutation({
        mutationFn: (data: HomepageProfileUpdateRequest) => updateHomepageProfile(data),    
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: homepageProfileKeys.root() });    
        }
    })
}