import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Video } from '../models/video/video';
import { VideoGallery } from '../models/video/videoGallery';
@Injectable({
  providedIn: 'root'
})
export class VideoService {

  url = 'http://garmannetworks.online:781';

    async getAllVideos(): Promise<Video[]>{
        const data = await fetch(this.url+'/videolist');
        return (await data.json()) ?? [];
    }

    async addVideo(video: Video): Promise<any> {
      try {
        console.log('Enviando video:', video);
    
        const response = await fetch(`${this.url}/admin/video`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(video),
        });
    
        if (!response.ok) {
          const errorData = await response.json(); 
          throw new Error(`Error ${response.status}: ${errorData.error || response.statusText}`);
        }
    
        const data = await response.json();
        console.log('videoGallery agregado con éxito:', data);
        return data; 
    
      } catch (error) {
        console.error('Error al agregar videoGallery:', error);
        throw error;
      }
    }

    async deleteVideo(_id: String | undefined): Promise<void> {
      try{
        const response = await fetch(`${this.url}/admin/video?_id=${_id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`Failed to delete video: ${response.status} ${response.statusText}`);
        }else{
          console.log('video deleted successfully');
        }
      }
      catch (error) {
        console.error('Error al eliminar el artículo:', error);
      }
    }

    async addVideoGallery(videoGallery: VideoGallery): Promise<any> {
      try {
        console.log('Enviando videoGallery:', videoGallery);
    
        const response = await fetch(`${this.url}/admin/videoGallery`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(videoGallery),
        });
    
        if (!response.ok) {
          const errorData = await response.json(); 
          throw new Error(`Error ${response.status}: ${errorData.error || response.statusText}`);
        }
    
        const data = await response.json();
        console.log('videoGallery agregado con éxito:', data);
        return data; 
    
      } catch (error) {
        console.error('Error al agregar videoGallery:', error);
        throw error;
      }
    }  

  async getVideoGallery(): Promise<VideoGallery | undefined>  {
    try {
      const response = await fetch(`${this.url}/videoGallery`);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch videoGallery: ${response.status} ${response.statusText}`);
      }
      const data: VideoGallery = await response.json();
      console.log('videoGallery fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Failed to fetch videoGallery:', error);
      return undefined; 
    }
  }

  async getVideoThumbnail(videoId: String): Promise<{ thumbnail: String }> {
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