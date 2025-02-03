import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Video } from '../models/video/video';
@Injectable({
  providedIn: 'root'
})
export class VideoService {
  
    url = 'http://garmannetworks.online:781';

    async getAllVideos(): Promise<Video[]>{
        const data = await fetch(this.url+'/videolist');
        return (await data.json()) ?? [];
    }

    async getVideoThumbnail(videoId: string): Promise<{ thumbnail: string }> {
      const vimeoUrl = `https://vimeo.com/api/v2/video/${videoId}.json`;
      try {
        const response = await fetch(vimeoUrl);
        const json = await response.json();
        
        if (json.length > 0) {
          return { thumbnail: json[0].thumbnail_large };
        } else {
          throw new Error('No thumbnail found');
        }
      } catch (error) {
        console.error(`Error fetching thumbnail for video ${videoId}:`, error);
        return { thumbnail: '' }; 
      }
    }
    
}